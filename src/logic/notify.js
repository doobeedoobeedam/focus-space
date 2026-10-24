import { ref } from 'vue'

export const toast = ref(null)

// status izin notifikasi - 'default' (belum ditanya), 'granted', 'denied', 'unsupported'
let startPermission = 'unsupported'
if (typeof Notification !== 'undefined') {
  startPermission = Notification.permission
}
export const permission = ref(startPermission)

let toastTimer = null

export async function askPermission() {
  try {
    permission.value = await Notification.requestPermission()
  } catch (error) {
    permission.value = 'unsupported'
  }
}

export function playBeep() {
  try {
    const audio = new AudioContext()
    const oscillator = audio.createOscillator()
    const volume = audio.createGain()
    oscillator.connect(volume)
    volume.connect(audio.destination)
    oscillator.frequency.value = 880
    volume.gain.setValueAtTime(0.2, audio.currentTime)
    volume.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 1)
    oscillator.start()
    oscillator.stop(audio.currentTime + 1)
  } catch (error) {

  }
}

// notif pop-up di app + getar + notifikasi perangkat (kalau diizinkan)
export function notify(title, body) {
  // pop-up di dalam aplikasi
  toast.value = { title: title, body: body }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(function () {
    toast.value = null
  }, 8000)

  // getar (hanya di HP yang support)
  try {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200])
    }
  } catch (error) {

  }

  // notifikasi bawaan
  try {
    if (permission.value === 'granted') {
      new Notification(title, { body: body })
    }
  } catch (error) {

  }
}
