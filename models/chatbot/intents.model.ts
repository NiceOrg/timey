/* eslint-disable prettier/prettier */
export class Intents {
  add: string[] = ['ajouter', 'ajoute', 'creer', 'crees', 'inserer', 'insere', 'insert']
  and: string[] = ['et', 'ainsi que', 'ainsi qu']
  bind: string[] = ['avec', 'qui contient', 'contenant', 'dont', 'ayant comme']
  color: string[] = ['couleur', 'coloris', 'nuance', 'teinte', 'ton']
  delete: string[] = ['supprimer', 'supprime', 'enlever', 'enleve']
  estimation: string[] = ['estimation']
  identifier: string[] = ['.+?(?=et|avec|couleur| a |$)']
  language: string[] = ['langue']
  naming: string[] = ['nom', 'nommee', 'nomme', 'appelle', 'dénomme']
  pause: string[] = ['pauses', 'pause']
  resume: string[] = ['reprises', 'reprise']
  start: string[] = ['lancer', 'lance']
  stop: string[] = ['arreter', 'arrete', 'stoppe', 'stop']
  tag: string[] = ['tag', 'etiquette', 'categorie']
  task: string[] = ['tache']
  timeSlot: string[] = ['plage horaire']
  to: string[] = ['a']
  update: string[] = ['modifier', 'modifie', 'changer', 'change', 'mets', 'mettre']
  time: string[] = [
    '.*(semaines|semaine|heures|heure|minutes|minute|secondes|seconde|2[0-3]h[0-5][0-9]|[0-9]h[0-5][0-9]|1[0-9]h[0-5][0-9]|[0-9]h|1[0-9]h|2[0-3]h)'
  ]

  constructor(data: Partial<Intents> = {}) {
    Object.assign(this, data)
  }

  public get(intent: any) {
    return this[intent]
  }
}
