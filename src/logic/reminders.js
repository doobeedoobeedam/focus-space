import { ref } from 'vue'
import { state } from '../store'
import { notify, playBeep } from './notify'

export const now = ref(Date.now())

let started = false

export function startReminderChecker() {
  if (started) {
    return
  }
  started = true

  setInterval(function () {
    now.value = Date.now()

    for (let i = 0; i < state.reminders.length; i++) {
      const reminder = state.reminders[i]
      // kalau belum dibunyikan dan waktunya sudah tiba
      if (!reminder.fired && reminder.at <= now.value) {
        reminder.fired = true
        playBeep()
        notify('⏰ ' + reminder.title, "It's time!")
      }
    }
  }, 1000)
}
