<template>
  <div class="page-settings">
    <div class="parameter" @click="$router.push('/settings/time-slots')">
      <div class="flex heading">
        Plage horaire
        <div class="switch" @click="stopPropagation($event)">
          <a-switch :checked="timeSlots.isActive" size="small" @change="changeTimeSlots" />
        </div>
      </div>
      <p>Définir une plage horaire de pause fixe</p>
    </div>
    <div class="parameter" @click="$router.push('/settings/export-data')">
      <div class="heading">Exporter données</div>
      <p>Exporter les données au format Excel</p>
    </div>
    <div class="about heading">A propos</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { stopPropagation } from '~/utils/event'
import { timeSlotsPlugin } from '~/plugins/parameters/time-slots.client'
import { TimeSlots } from '~/models/parameters/time-slots.model'

export default Vue.extend({
  layout: 'settings',
  data() {
    return {
      timeSlots: {} as TimeSlots,
      stopPropagation,
    }
  },
  beforeMount() {
    emit('parameter-name', 'Settings')
    this.timeSlots = timeSlotsPlugin.getTimeSlots()
  },
  methods: {
    changeTimeSlots(value: boolean) {
      timeSlotsPlugin.activate(value)
    },
  },
})
</script>

<style>
.parameter {
  padding-left: 1rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}

.heading {
  font-weight: 500;
  align-items: center;
}
.parameter > p {
  margin-bottom: 0;
}
.flex {
  display: flex;
}
.switch {
  margin-left: auto;
  margin-right: 1rem;
}
.parameter:hover {
  background: #ededed;
}
.about {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}
</style>
