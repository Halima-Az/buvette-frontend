// src/utils/timeUtils.js

export function timeAgo(date) {
  if (!date) return 'Never changed'

  const changedDate = new Date(date)
  if (isNaN(changedDate)) return 'Never changed' // si date invalide

  const now = new Date()
  const diffMs = now - changedDate
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 30) return `${diffDays} days ago`

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths === 1) return '1 month ago'
  if (diffMonths < 12) return `${diffMonths} months ago`

  const diffYears = Math.floor(diffMonths / 12)
  if (diffYears === 1) return '1 year ago'
  return `${diffYears} years ago`
}
