export function pad(number) {
  if (number < 10) {
    return '0' + number
  }
  return String(number)
}

// ubah tanggal jadi teks "2026-10-24"
export function dateKey(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
}

// bikin ID unik untuk setiap task, habit, catatan, dll
export function makeId() {
  return Date.now() + '-' + Math.floor(Math.random() * 10000)
}

// cari posisi (index) item di dalam daftar berdasarkan id-nya.
// hasilnya -1 kalau tidak ada
export function findIndexById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return i
    }
  }
  return -1
}

// ubah detik jadi "25:00"
export function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return pad(minutes) + ':' + pad(seconds)
}

// ubah milidetik jadi hitung mundur, misal "1h 5m 30s"
export function formatRemaining(milliseconds) {
  if (milliseconds <= 0) {
    return 'Now'
  }
  let seconds = Math.floor(milliseconds / 1000)
  const days = Math.floor(seconds / 86400)
  seconds = seconds % 86400
  const hours = Math.floor(seconds / 3600)
  seconds = seconds % 3600
  const minutes = Math.floor(seconds / 60)
  seconds = seconds % 60

  let text = ''
  if (days > 0) text = text + days + 'd '
  if (days > 0 || hours > 0) text = text + hours + 'h '
  if (days > 0 || hours > 0 || minutes > 0) text = text + minutes + 'm '
  text = text + seconds + 's'
  return text
}

// ubah waktu (milidetik) jadi teks
export function toInputDateTime(milliseconds) {
  const d = new Date(milliseconds)
  return dateKey(d) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes())
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// ubah waktu (milidetik) jadi teks
export function formatDateTime(milliseconds) {
  const d = new Date(milliseconds)

  // ubah jam 24-jam jadi 12-jam + AM/PM
  let hours = d.getHours()
  let ampm = 'AM'
  if (hours >= 12) {
    ampm = 'PM'
  }
  hours = hours % 12
  if (hours === 0) {
    hours = 12
  }

  return (
    d.getDate() + ' ' + MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear() +
    ', ' + hours + ':' + pad(d.getMinutes()) + ' ' + ampm
  )
}

export function formatDate(dateText) {
  const parts = dateText.split('-')
  const year = parts[0]
  const month = Number(parts[1]) - 1 // di array, bulan mulai dari 0
  const day = Number(parts[2])
  return day + ' ' + MONTH_NAMES[month] + ' ' + year
}