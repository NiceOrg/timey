<template>
  <div class="page-settings">
    <div class="parameter highlight" @click="$router.push('/settings/time-slots')">
      <div class="flex heading">
        Plage horaire
        <div class="switch" @click="stopPropagation($event)">
          <a-switch :checked="timeSlots.isActive" size="small" @change="changeTimeSlots" />
        </div>
      </div>
      <p>Définir une plage horaire de pause fixe</p>
    </div>
    <div class="parameter" @click="$router.push('/tags-edition')">
      <div class="flex heading">Édition de tags</div>
      <p>Éditer ou créer vos tags</p>
    </div>
    <a-popconfirm title="Le document va être téléchargé, continuer ? " ok-text="Oui" cancel-text="Non" @confirm="exportPlugin.downloadCSV()">
      <div class="parameter highlight">
        <div class="heading">Exporter données</div>
        <p>Exporter les données au format Excel</p>
      </div>
    </a-popconfirm>
    <div class="about heading">A propos</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { emit } from 'shuutils'
import { stopPropagation } from '~/utils'
import { timeSlotsPlugin, exportPlugin, NAVBAR } from '~/plugins'
import { Navbar, TimeSlots } from '~/models'

export default Vue.extend({
  data() {
    return {
      timeSlots: {} as TimeSlots,
      stopPropagation,
      exportPlugin,
    }
  },
  beforeMount() {
    emit(NAVBAR, new Navbar({ title: 'Options' }))
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

.highlight {
  background: var(--accent-light, gray);
}

.about {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}
</style>
