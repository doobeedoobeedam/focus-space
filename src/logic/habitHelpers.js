// untuk menghitung progress, status, dan streak habit

// setiap habit punya "logs", contohnya { "2026-10-24": 3, "2026-10-23": 8 }
// artinya tanggal 24 Okt sudah check-in 3x, tanggal 23 Okt 8x

import { dateKey } from './helpers'

function getWeekKeys(date) {
  const dayOfWeek = date.getDay() // 0 = Minggu, 1 = Senin, ... 6 = Sabtu
  let daysSinceMonday = dayOfWeek - 1
  if (dayOfWeek === 0) {
    daysSinceMonday = 6
  }

  const keys = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(date)
    d.setDate(date.getDate() - daysSinceMonday + i)
    keys.push(dateKey(d))
  }
  return keys
}

// jumlahkan check-in di daftar tanggal tertentu
function countCheckIns(habit, keys) {
  let total = 0
  for (let i = 0; i < keys.length; i++) {
    const count = habit.logs[keys[i]]
    if (count) {
      total = total + count
    }
  }
  return total
}

// tanggal-tanggal yang dihitung untuk satu "periode" (1 hari atau 1 minggu)
function getPeriodKeys(habit, date) {
  if (habit.period === 'day') {
    return [dateKey(date)]
  }
  return getWeekKeys(date)
}

// sudah berapa kali check-in hari ini / minggu ini
export function getProgress(habit) {
  return countCheckIns(habit, getPeriodKeys(habit, new Date()))
}

// status habit
export function getStatus(habit) {
  const today = dateKey(new Date())
  if (habit.start && today < habit.start) {
    return 'upcoming'
  }
  if (habit.end && today > habit.end) {
    return 'ended'
  }
  return 'active'
}

function isTargetReached(habit, date) {
  return countCheckIns(habit, getPeriodKeys(habit, date)) >= habit.target
}

export function getStreak(habit) {
  let stepDays = 1
  if (habit.period === 'week') {
    stepDays = 7
  }

  let streak = 0
  const cursor = new Date()

  // kalau hari/minggu ini belum selesai, mulai hitung dari periode sebelumnya
  if (!isTargetReached(habit, cursor)) {
    cursor.setDate(cursor.getDate() - stepDays)
  }

  // mundur terus selama targetnya tercapai
  while (isTargetReached(habit, cursor) && streak < 1000) {
    streak = streak + 1
    cursor.setDate(cursor.getDate() - stepDays)
  }
  return streak
}

export function addCheckIn(habit, amount) {
  const today = dateKey(new Date())
  let current = habit.logs[today]
  if (!current) {
    current = 0
  }
  let newValue = current + amount
  if (newValue < 0) {
    newValue = 0
  }
  habit.logs[today] = newValue
}
