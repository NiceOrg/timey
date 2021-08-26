import Vue from 'vue'
export const stopPropagation = (event: Event): void => event.stopPropagation()

export const eventBus = new Vue()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const on = (eventName: string, callback: (data: any) => unknown): void =>
  window.addEventListener(eventName as keyof WindowEventMap, callback as unknown as EventListener)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const off = (eventName: string, callback: (data: any) => unknown): void => window.removeEventListener(eventName, callback)
