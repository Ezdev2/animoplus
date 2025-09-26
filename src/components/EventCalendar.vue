<template>
  <div class="event-calendar">
    <div class="calendar-header">
      <button @click="previousWeek" class="nav-btn">‹</button>
      <span class="calendar-week">
        Semaine du {{ formatDate(weekStart) }} au {{ formatDate(weekEnd) }}
      </span>
      <button @click="nextWeek" class="nav-btn">›</button>
    </div>

    <table class="calendar-table">
      <thead>
        <tr>
          <th class="time-col">Heures</th>
          <th v-for="day in currentWeekDays" :key="day.toDateString()">
            {{ dayNames[day.getDay()] }}<br />
            {{ day.getDate() }}/{{ day.getMonth() + 1 }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="hour in hours" :key="hour">
          <td class="time-col">{{ hour }}:00</td>

          <td v-for="day in currentWeekDays" 
              :key="day.toISOString() + '-' + hour" 
              class="time-slot"
              :class="{ 
                'selected': isSlotSelected(day, hour),
                'selecting': isSelecting && isInSelectionRange(day, hour)
              }"
              @mousedown="startSelection(day, hour)"
              @mouseover="updateSelection(day, hour)"
              @mouseup="endSelection">
            
            <!-- Événements existants -->
            <div v-for="event in getEventsForSlot(day, hour)" 
                 :key="event.id" 
                 class="event"
                 @click.stop="handleEventClick(event)">
              {{ event.title }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bouton de confirmation si sélection active -->
    <div v-if="selectedSlots.length > 0" class="selection-controls">
      <div class="selection-info">
        {{ selectedSlots.length }} créneau(x) sélectionné(s)
        <span v-if="selectedSlots.length > 1">
          ({{ formatSelectionDuration() }})
        </span>
      </div>
      <button @click="confirmSelection" class="confirm-btn">
        Créer un rendez-vous
      </button>
      <button @click="clearSelection" class="cancel-btn">
        Annuler
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  events: { type: Array, default: () => [] },
  initialDate: { type: Date, default: () => new Date() },
  startHour: { type: Number, default: 8 },
  endHour: { type: Number, default: 20 },
  maxSelectionHours: { type: Number, default: 5 }
})

// Emits
const emit = defineEmits(['slot-click', 'slots-selected', 'event-click', 'week-change'])

// Data
const currentDate = ref(new Date(props.initialDate))
const selectedSlots = ref([])
const isSelecting = ref(false)
const selectionStart = ref(null)
const selectionEnd = ref(null)

// Utils
const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const hours = computed(() =>
  Array.from({ length: props.endHour - props.startHour + 1 }, (_, i) => props.startHour + i)
)

// Calcul de la semaine en cours
const weekStart = computed(() => {
  const d = new Date(currentDate.value)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
})

const weekEnd = computed(() => {
  const d = new Date(weekStart.value)
  return new Date(d.setDate(d.getDate() + 6))
})

const currentWeekDays = computed(() => {
  const days = []
  const d = new Date(weekStart.value)
  for (let i = 0; i < 7; i++) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
})

// Méthodes
const formatDate = (date) =>
  date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

const getEventsForSlot = (day, hour) => {
  return props.events.filter(event => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getFullYear() === day.getFullYear() &&
      eventDate.getMonth() === day.getMonth() &&
      eventDate.getDate() === day.getDate() &&
      eventDate.getHours() === hour
    )
  })
}

// Gestion de la sélection multiple
const getSlotKey = (day, hour) => {
  return `${day.toDateString()}-${hour}`
}

const isSlotSelected = (day, hour) => {
  const key = getSlotKey(day, hour)
  return selectedSlots.value.some(slot => slot.key === key)
}

const startSelection = (day, hour) => {
  // Ne pas permettre la sélection sur des créneaux avec des événements
  if (getEventsForSlot(day, hour).length > 0) return
  
  isSelecting.value = true
  selectionStart.value = { day: new Date(day), hour }
  selectionEnd.value = { day: new Date(day), hour }
  
  // Effacer la sélection précédente
  selectedSlots.value = []
}

const updateSelection = (day, hour) => {
  if (!isSelecting.value) return
  
  selectionEnd.value = { day: new Date(day), hour }
}

const endSelection = () => {
  if (!isSelecting.value) return
  
  isSelecting.value = false
  
  if (selectionStart.value && selectionEnd.value) {
    const slots = calculateSelectedSlots()
    
    if (slots.length > props.maxSelectionHours) {
      alert(`Vous ne pouvez sélectionner que ${props.maxSelectionHours} créneaux maximum.`)
      return
    }
    
    selectedSlots.value = slots
  }
}

const calculateSelectedSlots = () => {
  if (!selectionStart.value || !selectionEnd.value) return []
  
  const slots = []
  const start = selectionStart.value
  const end = selectionEnd.value
  
  if (start.day.toDateString() === end.day.toDateString()) {
    const minHour = Math.min(start.hour, end.hour)
    const maxHour = Math.max(start.hour, end.hour)
    
    for (let h = minHour; h <= maxHour; h++) {
      if (getEventsForSlot(start.day, h).length === 0) {
        const slotDate = new Date(start.day)
        slotDate.setHours(h, 0, 0, 0)
        
        slots.push({
          key: getSlotKey(start.day, h),
          day: new Date(start.day),
          hour: h,
          date: slotDate
        })
      }
    }
  }
  
  return slots
}

const isInSelectionRange = (day, hour) => {
  if (!isSelecting.value || !selectionStart.value || !selectionEnd.value) return false
  
  const start = selectionStart.value
  const end = selectionEnd.value
  
  if (start.day.toDateString() === end.day.toDateString() && 
      day.toDateString() === start.day.toDateString()) {
    const minHour = Math.min(start.hour, end.hour)
    const maxHour = Math.max(start.hour, end.hour)
    return hour >= minHour && hour <= maxHour
  }
  
  return false
}

const formatSelectionDuration = () => {
  const duration = selectedSlots.value.length
  return duration === 1 ? '1 heure' : `${duration} heures`
}

const confirmSelection = () => {
  if (selectedSlots.value.length === 0) return
  
  const selectionData = {
    slots: selectedSlots.value,
    startDate: selectedSlots.value[0].date,
    endDate: selectedSlots.value[selectedSlots.value.length - 1].date,
    duration: selectedSlots.value.length,
    startTime: `${selectedSlots.value[0].hour}:00`,
    endTime: `${selectedSlots.value[selectedSlots.value.length - 1].hour + 1}:00`
  }
  
  emit('slots-selected', selectionData)
  clearSelection()
}

const clearSelection = () => {
  selectedSlots.value = []
  isSelecting.value = false
  selectionStart.value = null
  selectionEnd.value = null
}

// Gestion du clic sur un événement
const handleEventClick = (event) => {
  console.log('Clic sur événement:', event)
  emit('event-click', event)
}

const previousWeek = () => {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() - 7)
  currentDate.value = d
  emit('week-change', d)
}

const nextWeek = () => {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() + 7)
  currentDate.value = d
  emit('week-change', d)
}

const handleGlobalMouseUp = () => {
  if (isSelecting.value) {
    endSelection()
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', handleGlobalMouseUp)
}

import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('mouseup', handleGlobalMouseUp)
  }
})
</script>

<style scoped>
.event-calendar {
  width: 100%;
  font-family: "League Spartan", Arial, sans-serif;
  user-select: none;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.calendar-week {
  font-size: 18px;
  font-weight: 500;
}

.nav-btn {
  background: #43A047;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background: #388E3C;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
}

.calendar-table th,
.calendar-table td {
  border: 1px solid #eee;
  text-align: center;
  padding: 4px;
}

.time-col {
  width: 60px;
  background: #f5f5f5;
  font-weight: bold;
}

.time-slot {
  height: 60px;
  cursor: pointer;
  vertical-align: top;
  position: relative;
  transition: background-color 0.2s;
}

.time-slot:hover {
  background: #f9f9f9;
}

.time-slot.selected {
  background: #E8F5E8 !important;
  border: 2px solid #43A047;
}

.time-slot.selecting {
  background: #FFF3E0 !important;
  border: 2px dashed #FF9800;
}

.event {
  background: #E3F2FD;
  color: #2196F3;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 2px 0;
  text-align: left;
  pointer-events: auto;
  cursor: pointer;
  transition: background-color 0.2s;
}

.event:hover {
  background: #BBDEFB;
}

.selection-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.selection-info {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.confirm-btn {
  background: #43A047;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.confirm-btn:hover {
  background: #388E3C;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #5a6268;
}
</style>