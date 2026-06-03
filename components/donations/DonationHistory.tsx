'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle, Upload, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toaster'
import { Donation } from '@/types'

const SOURCE_LABELS: Record<string, string> = {
  self: 'Self-logged',
  campaign: 'Via Campaign',
  hospital_auto: 'Hospital',
}

interface Props {
  donations: Donation[]
  isOwnProfile?: boolean
}

export function DonationHistory({ donations, isOwnProfile = false }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  async function handleCertificateUpload(donationId: string, file: File) {
    setUploading(donationId)
    const formData = new FormData()
    formData.append('certificate', file)
    const res = await fetch(`/api/donations/${donationId}/certificate`, { method: 'PATCH', body: formData })
    if (res.ok) {
      toast({ type: 'success', title: 'Certificate uploaded!' })
    } else {
      toast({ type: 'error', title: 'Upload failed', description: 'Please try again.' })
    }
    setUploading(null)
  }

  const displayed = expanded ? donations : donations.slice(0, 3)

  return (
    <Card>
      <CardContent className="pt-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between mb-4 text-left"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">
            My Donation History ({donations.length})
          </h2>
          {expanded
            ? <ChevronUp className="h-4 w-4 text-gray-400" />
            : <ChevronDown className="h-4 w-4 text-gray-400" />
          }
        </button>

        {donations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No donations logged yet</p>
        ) : (
          <div className="space-y-3">
            {displayed.map((donation) => {
              const d = donation as Donation & { source?: string; verified?: boolean }
              return (
                <div key={d.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-base">
                        {format(new Date(d.donated_at), 'dd MMM yyyy')}
                      </p>
                      {d.hospital_name && d.hospital_name !== 'Not specified' && (
                        <p className="text-sm text-gray-500">{d.hospital_name}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                        {SOURCE_LABELS[d.source || 'self']}
                      </span>
                      {d.verified && (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-medium">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Rest period until: {format(new Date(d.cooldown_ends_at), 'dd MMM yyyy')}
                  </p>
                  {d.notes && (
                    <p className="text-xs text-gray-400 italic">{d.notes}</p>
                  )}
                  {isOwnProfile && !d.certificate_url && (
                    <label className="flex items-center gap-1.5 text-xs text-[#C0392B] hover:underline cursor-pointer w-fit">
                      <Upload className="h-3.5 w-3.5" />
                      {uploading === d.id ? 'Uploading...' : 'Upload certificate'}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        disabled={uploading === d.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleCertificateUpload(d.id, file)
                        }}
                      />
                    </label>
                  )}
                  {d.certificate_url && (
                    <a
                      href={d.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline w-fit"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> View certificate
                    </a>
                  )}
                </div>
              )
            })}
            {donations.length > 3 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-sm text-[#C0392B] hover:underline pt-1"
              >
                {expanded ? 'Show less' : `Show ${donations.length - 3} more`}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
