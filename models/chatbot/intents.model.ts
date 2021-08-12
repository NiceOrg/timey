export const INTENTS = {
  add: ['ajouter', 'ajoute', 'creer', 'crees', 'inserer', 'insere', 'insert'],
  and: ['et', 'ainsi que', 'ainsi qu'],
  bind: ['avec', 'qui contient', 'contenant', 'dont', 'ayant comme'],
  color: ['couleur', 'coloris', 'nuance', 'teinte', 'ton'],
  delete: ['supprimer', 'supprime', 'enlever', 'enleve'],
  estimation: ['estimation'],
  identifier: ['.+?(?=et|avec|couleur| a |$)'],
  language: ['langue'],
  naming: ['nom', 'nommee', 'nomme', 'appelle', 'dénomme'],
  pause: ['pauses', 'pause'],
  resume: ['reprises', 'reprise'],
  start: ['lancer', 'lance'],
  stop: ['arreter', 'arrete', 'stoppe', 'stop'],
  tag: ['tag', 'etiquette', 'categorie'],
  task: ['tache'],
  timeSlot: ['plage horaire'],
  to: ['a'],
  update: ['modifier', 'modifie', 'changer', 'change', 'mets', 'mettre'],
  time: [
    '.*(semaines|semaine|heures|heure|minutes|minute|secondes|seconde|2[0-3]h[0-5][0-9]|[0-9]h[0-5][0-9]|1[0-9]h[0-5][0-9]|[0-9]h|1[0-9]h|2[0-3]h)',
  ],
}

export type IntentName = keyof typeof INTENTS
