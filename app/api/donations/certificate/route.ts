import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { DonationCertificate } from '@/components/profile/donation-certificate'
import { createElement } from 'react'
import { generateCertificateNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { donation_id } = await request.json()
  if (!donation_id) return NextResponse.json({ error: 'donation_id required' }, { status: 400 })

  const { data: donation } = await supabase
    .from('donations')
    .select('*, donor:profiles!donor_id(full_name, blood_group)')
    .eq('id', donation_id)
    .eq('donor_id', user.id)
    .single()

  if (!donation) return NextResponse.json({ error: 'Donation not found' }, { status: 404 })

  try {
    const donationData = donation as any
    const certificateNumber = generateCertificateNumber(donationData.id)
    const element = createElement(DonationCertificate as any, {
      donorName: donationData.donor?.full_name || 'Donor',
      bloodGroup: donationData.donor?.blood_group || 'Unknown',
      donatedAt: donationData.donated_at,
      hospitalName: donationData.hospital_name,
      district: donationData.district,
      certificateNumber,
    })

    const pdfBuffer = await renderToBuffer(element as any)

    // Upload to Supabase Storage
    const fileName = `certificates/${donationData.id}.pdf`
    const { error: uploadError } = await supabase.storage
      .from('donations')
      .upload(fileName, pdfBuffer, { contentType: 'application/pdf', upsert: true })

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('donations').getPublicUrl(fileName)
      await supabase.from('donations').update({ certificate_url: urlData.publicUrl }).eq('id', donation_id)
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="donation-certificate-${certificateNumber}.pdf"`,
      },
    })
  } catch (err) {
    console.error('Certificate generation error:', err)
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 })
  }
}
