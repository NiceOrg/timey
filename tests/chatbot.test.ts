// eslint-disable-next-line unicorn/prefer-node-protocol
import { strictEqual as equal, deepStrictEqual as deepEqual, throws } from 'assert'
import { AnalyzeError, Intent, SpeechRequest } from '../models'
import { analysis } from '../plugins'

describe('chabot', () => {
  describe('speech request model', () => {
    it('Instantiate new speech request with default params', () => {
      const speechRequest = new SpeechRequest({})
      equal(speechRequest.response, '')
      equal(speechRequest.sentence, '')
    })
  })

  describe('analyse', () => {
    it('basic sentences with add', () => {
      deepEqual(analysis.analyze('ajoute une tache faire de la musculation'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'faire de la musculation' }),
      ])

      deepEqual(analysis.analyze('ajoute une tache faire de la musculation avec un tag sport de couleur bleu clair'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'faire de la musculation' }),
        new Intent({ tag: 'bind', word: 'avec' }),
        new Intent({ tag: 'tag', word: 'tag' }),
        new Intent({ tag: 'identifier', word: 'sport de' }),
        new Intent({ tag: 'color', word: 'couleur' }),
        new Intent({ tag: 'identifier', word: 'bleu clair' }),
      ])

      deepEqual(analysis.analyze('ajoute une plage horaire de pause à 12h'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'timeSlot', word: 'plage horaire' }),
        new Intent({ tag: 'pause', word: 'pause' }),
        new Intent({ tag: 'time', word: 'a 12h' }),
      ])

      deepEqual(analysis.analyze('ajoute un tag lambda'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'tag', word: 'tag' }),
        new Intent({ tag: 'identifier', word: 'lambda' }),
      ])

      deepEqual(analysis.analyze('lance la tache machin'), [
        new Intent({ tag: 'start', word: 'lance' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'machin' }),
      ])

      deepEqual(analysis.analyze('arrete'), [new Intent({ tag: 'stop', word: 'arrete' })])

      deepEqual(analysis.analyze('ajoute une tache lambda avec une estimation de 2 semaines 3h30 et 10 secondes'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'lambda' }),
        new Intent({ tag: 'bind', word: 'avec' }),
        new Intent({ tag: 'estimation', word: 'estimation' }),
        new Intent({ tag: 'time', word: 'de 2 semaines 3h30 et 10 secondes' }),
      ])

      deepEqual(analysis.analyze('ajoute un tag truc à la tâche lambda'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'tag', word: 'tag' }),
        new Intent({ tag: 'identifier', word: 'truc' }),
        new Intent({ tag: 'to', word: 'a' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'lambda' }),
      ])
    })

    it('basic sentences with delete', () => {
      deepEqual(analysis.analyze('supprime la tache faire du sport'), [
        new Intent({ tag: 'delete', word: 'supprime' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'faire du sport' }),
      ])
    })

    it('secondary analyze', () => {
      throws(() => {
        analysis.analyze('lance une tache')
      }, new AnalyzeError('Quelle tâche souhaitez-vous lancer ?'))
      deepEqual(analysis.analyze('sport', true), [
        new Intent({ tag: 'start', word: 'lance' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'sport' }),
      ])
    })

    it('error sentences', () => {
      throws(() => {
        analysis.analyze('raconte une blague')
      }, new AnalyzeError("Excusez-moi, je n'ai pas compris"))
      throws(() => {
        analysis.analyze('ajoute')
      }, new AnalyzeError('Que souhaitez-vous ajouter ?'))
      throws(() => {
        analysis.analyze('supprime')
      }, new AnalyzeError('Que souhaitez-vous supprimer ?'))
      throws(() => {
        analysis.analyze('ajoute une tache')
      }, new AnalyzeError('Quel est le nom de la tâche ?'))
      throws(() => {
        analysis.analyze('ajoute un tag')
      }, new AnalyzeError('Quel est le nom du tag ?'))
      throws(() => {
        analysis.analyze('ajoute un tag lambda de couleur')
      }, new AnalyzeError('Quel est la couleur du tag ?'))
      throws(() => {
        analysis.analyze('ajoute une tache x avec une estimation')
      }, new AnalyzeError('En combien de temps estimez vous finir la tâche ?'))
      throws(() => {
        analysis.analyze('ajoute une plage horaire')
      }, new AnalyzeError('Voulez-vous ajouter une plage horaire de pause ou de reprise ?'))
      throws(() => {
        analysis.analyze('ajoute une plage horaire de pause')
      }, new AnalyzeError('A quelle heure ?'))
      throws(() => {
        analysis.analyze('ajoute une plage horaire de reprise')
      }, new AnalyzeError('A quelle heure ?'))
      throws(() => {
        analysis.analyze('ajouter une tache avec')
      }, new AnalyzeError('Que souhaitez-vous rajouter à la tâche ?'))
      throws(() => {
        analysis.analyze('lance une tache')
      }, new AnalyzeError('Quelle tâche souhaitez-vous lancer ?'))
      throws(() => {
        analysis.analyze('ajoute un tag truc à la tâche')
      }, new AnalyzeError('A quelle tâche souhaitez-vous appliquer le tag ?'))

      throws(() => {
        analysis.analyze('ajoute une estimation')
      }, new AnalyzeError('En combien de temps estimez vous finir la tâche ?'))

      throws(() => {
        analysis.analyze('ajoute une estimation a la tache sport')
      }, new AnalyzeError('En combien de temps estimez vous finir la tâche ?'))

      throws(() => {
        analysis.analyze('ajoute une estimation de 3 heures')
      }, new AnalyzeError('A quelle tâche voulez-vous ajouter cette estimation ?'))
    })
  })
})
