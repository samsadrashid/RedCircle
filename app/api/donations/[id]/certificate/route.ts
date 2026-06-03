import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: donation } = await supabase
    .from('donations')
    .select('id')
    .eq('id', params.id)
    .eq('donor_id', user.id)
    .single()

  if (!donation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const formData = await request.formData()
  const file = formData.get('certificate') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ext = file.name.split('.').pop() || 'pdf'
  const fileName = `certificates/${params.id}.${ext}`
  const buffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from('donation-certificates')
    .upload(fileName, buffer, { contentType: file.type, upsert: true })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from('donation-certificates').getPublicUrl(fileName)
  await supabase.from('donations').update({ certificate_url: urlData.publicUrl }).eq('id', params.id)

  return NextResponse.json({ certificate_url: urlData.publicUrl })
}
