'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Check, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/toaster'
import { Notification, NotificationType } from '@/types'
import { timeAgo, cn } from '@/lib/utils'

const TYPE_ICONS: Record<NotificationType, string> = {
  cooldown_expired: '🎉',
  new_request_match: '🩸',
  campaign_nearby: '📅',
  thank_you: '💌',
  volunteer_confirmed: '✅',
  badge_awarded: '🏅',
  request_fulfilled: '✅',
}

interface Props {
  notifications: Notification[]
  userId: string
}

export function NotificationsCenter({ notifications: initial, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [notifications, setNotifications] = useState(initial)
  const [loading, setLoading] = useState(false)

  const unreadCount = notifications.filter(n => !n.is_read).length

  async function markAllRead() {
    setLoading(true)
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setLoading(false)
    router.refresh()
  }

  async function markRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    router.refresh()
  }

  async function deleteAll() {
    setLoading(true)
    await supabase.from('notifications').delete().eq('user_id', userId)
    setNotifications([])
    setLoading(false)
  }

  return (
    <div>
      {notifications.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{unreadCount} unread</p>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} loading={loading}>
                <Check className="h-4 w-4" /> Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={deleteAll} loading={loading} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Clear all
            </Button>
          </div>
        </div>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="All caught up!"
          description="No notifications yet. We'll notify you when someone responds to a request or when you're eligible to donate again."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => (
            <Card
              key={notification.id}
              className={cn(!notification.is_read && 'border-[#C0392B]/20 bg-red-50/30 dark:bg-red-950/10')}
              onClick={() => !notification.is_read && markRead(notification.id)}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">
                    {TYPE_ICONS[notification.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm font-medium', !notification.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300')}>
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#C0392B] shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{notification.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
