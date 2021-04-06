import Vue from 'vue'
export const stopPropagation = (event: Event) => event.stopPropagation()

export const eventBus = new Vue()
