import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatPrice(price) {
  if (!price && price !== 0) return '—'
  return `₹${Number(price).toLocaleString('en-IN')}`
}

export function getCurrentSeason() {
  const month = new Date().getMonth() + 1
  if (month >= 6 && month <= 10) return 'Kharif'
  if (month >= 11 || month <= 3) return 'Rabi'
  return 'Zaid'
}
