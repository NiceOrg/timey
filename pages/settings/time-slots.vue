<template>
  <div class="page-time-slots">
    <div class="text-info">{{ $t('settings.time-slots-submessage') }}</div>
    <div v-if="timeSlotsToUpdate.length === 0" class="text-info">{{ $t('settings.time-slots-no-data') }}</div>
    <div v-else class="table">
      <div class="table-header wrapper">
        <div>{{ $t('global.break') }}</div>
        <div>{{ $t('global.resume') }}</div>
      </div>
      <div v-for="(timeSlot, index) in timeSlotsToUpdate" :key="index" class="table-body wrapper">
        <template v-if="timeSlot.edit">
          <a-input v-model="timeSlot.pause" class="input" />
          <a-input v-model="timeSlot.resume" class="input" />
          <div class="table-element-center" @click="save(index)">{{ $t('global.save') }}</div>
          <div class="table-element-center" @click="cancel(index)">{{ $t('global.cancel') }}</div>
        </template>
        <template v-else>
          <div>{{ timeSlot.pause }}</div>
          <div>{{ timeSlot.resume }}</div>
          <div class="table-element-center" @click="update(index)">{{ $t('global.edit') }}</div>
          <div class="table-element-center" @click="remove(index)">{{ $t('global.delete') }}</div>
        </template>
      </div>
    </div>
    <div class="add-button">
      <a-button shape="circle" size="large" icon="plus" @click="add()" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit, on } from 'shuutils'
import { Navbar, TimeSlots, TimeSlotsUpdate } from '~/models'
import { NAVBAR_SETTINGS, timeSlotsPlugin, TIME_SLOT_GET, TIME_SLOT_SEND } from '~/plugins'
import { hours, minutes } from '~/utils'

export default Vue.extend({
  data() {
    return {
      timeSlots: {} as TimeSlots,
      timeSlotsToUpdate: [] as TimeSlotsUpdate[],
    }
  },
  beforeMount() {
    on(TIME_SLOT_SEND, (timeSlots: TimeSlots) => (this.timeSlots = timeSlots))
    emit(TIME_SLOT_GET)
    emit(NAVBAR_SETTINGS, new Navbar({ title: 'Plage horaire', backButton: true }))
    this.fillTimeSlotsToUpdate(this.timeSlots.pause, this.timeSlots.resume)
  },
  methods: {
    update(index: number) {
      this.timeSlotsToUpdate[index].edit = true
    },
    cancel(index: number) {
      this.fillTimeSlotsToUpdate(this.timeSlots.pause, this.timeSlots.resume)
      if (this.timeSlotsToUpdate[index]) this.timeSlotsToUpdate[index].edit = false
    },
    save(index: number) {
      this.timeSlots.pause[index] = this.stringToTimestamp(this.timeSlotsToUpdate[index].pause)
      this.timeSlots.resume[index] = this.stringToTimestamp(this.timeSlotsToUpdate[index].resume)
      timeSlotsPlugin.update(this.timeSlots)
      this.timeSlotsToUpdate[index].edit = false
    },
    remove(index: number) {
      this.timeSlotsToUpdate.splice(index, 1)
      this.timeSlots.pause.splice(index, 1)
      this.timeSlots.resume.splice(index, 1)
      timeSlotsPlugin.update(this.timeSlots)
    },
    add() {
      this.timeSlotsToUpdate.push(new TimeSlotsUpdate())
    },
    fillTimeSlotsToUpdate(pauseTimeStamps: number[], resumeTimeStamps: number[]) {
      this.timeSlotsToUpdate = []
      for (const [index, pauseTimeStamp] of pauseTimeStamps.entries()) {
        const timeSlot = {} as TimeSlotsUpdate
        timeSlot.pause = hours(pauseTimeStamp) + 'h' + minutes(pauseTimeStamp)
        timeSlot.resume = hours(resumeTimeStamps[index]) + 'h' + minutes(resumeTimeStamps[index])
        timeSlot.edit = false
        this.timeSlotsToUpdate.push(timeSlot)
      }
    },
    stringToTimestamp(time: string) {
      const [hours, minutes] = time.split('h')
      return (Number(hours) * 3600 + Number(minutes) * 60) * 1000
    },
  },
})
</script>

<style>
.text-info {
  height: 4rem;
}

.input {
  width: 4rem;
}

.add-button {
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 2rem;
}
</style>
