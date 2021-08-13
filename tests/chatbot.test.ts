// eslint-disable-next-line unicorn/prefer-node-protocol
import { strictEqual as equal, deepStrictEqual as deepEqual, throws } from 'assert'
import { AnalyzeError, ExecutionError, Intent, SpeechRequest, Tree } from '../models'
import { analysis, generate, speechToTextPlugin } from '../plugins'

describe('chabot', () => {
  describe('speech request model', () => {
    it('Instantiate new speech request with default params', () => {
      const speechRequest = new SpeechRequest({})
      equal(speechRequest.response, '')
      equal(speechRequest.sentence, '')
    })
  })

  describe('tree model', () => {
    it('Instantiate new tree with default params', () => {
      const tree = new Tree({})
      equal(tree.childIndex, 0)
      equal(tree.index, 0)
      deepEqual(tree.children, [])
      deepEqual(tree.intent, {})
    })
    it('add child', () => {
      const tree = new Tree({})
      tree.add(new Tree({ index: 1 }))
      deepEqual(tree.children[0], new Tree({ index: 1 }))
    })
  })

  describe('error model', () => {
    it('Instantiate new analyse error', () => {
      const analyzeError = new AnalyzeError()
      equal(analyzeError.message, '')
    })
    it('Instantiate new execution error', () => {
      const executionError = new ExecutionError()
      equal(executionError.message, '')
    })
  })

  describe('analyze', () => {
    it('basic sentences with add', () => {
      deepEqual(analysis.start('ajoute une tache faire de la musculation'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'faire de la musculation' }),
      ])

      deepEqual(analysis.start('ajoute une tache faire de la musculation avec un tag sport de couleur bleu clair'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'faire de la musculation' }),
        new Intent({ tag: 'bind', word: 'avec' }),
        new Intent({ tag: 'tag', word: 'tag' }),
        new Intent({ tag: 'identifier', word: 'sport de' }),
        new Intent({ tag: 'color', word: 'couleur' }),
        new Intent({ tag: 'identifier', word: 'bleu clair' }),
      ])

      deepEqual(analysis.start('ajoute une plage horaire de pause à 12h'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'timeSlot', word: 'plage horaire' }),
        new Intent({ tag: 'pause', word: 'pause' }),
        new Intent({ tag: 'time', word: 'a 12h' }),
      ])

      deepEqual(analysis.start('ajoute un tag lambda'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'tag', word: 'tag' }),
        new Intent({ tag: 'identifier', word: 'lambda' }),
      ])

      deepEqual(analysis.start('lance la tache machin'), [
        new Intent({ tag: 'start', word: 'lance' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'machin' }),
      ])

      deepEqual(analysis.start('arrete'), [new Intent({ tag: 'stop', word: 'arrete' })])

      deepEqual(analysis.start('ajoute une tache lambda avec une estimation de 2 semaines 3h30 et 10 secondes'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'lambda' }),
        new Intent({ tag: 'bind', word: 'avec' }),
        new Intent({ tag: 'estimation', word: 'estimation' }),
        new Intent({ tag: 'time', word: 'de 2 semaines 3h30 et 10 secondes' }),
      ])

      deepEqual(analysis.start('ajoute un tag truc à la tâche lambda'), [
        new Intent({ tag: 'add', word: 'ajoute' }),
        new Intent({ tag: 'tag', word: 'tag' }),
        new Intent({ tag: 'identifier', word: 'truc' }),
        new Intent({ tag: 'to', word: 'a' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'lambda' }),
      ])
    })

    it('basic sentences with delete', () => {
      deepEqual(analysis.start('supprime la tache faire du sport'), [
        new Intent({ tag: 'delete', word: 'supprime' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'faire du sport' }),
      ])
    })

    it('secondary analyze', () => {
      throws(() => {
        analysis.start('lance une tache')
      }, new AnalyzeError('Quelle tâche souhaitez-vous lancer ?'))
      deepEqual(analysis.start('sport', true), [
        new Intent({ tag: 'start', word: 'lance' }),
        new Intent({ tag: 'task', word: 'tache' }),
        new Intent({ tag: 'identifier', word: 'sport' }),
      ])
    })

    it('error sentences', () => {
      throws(() => {
        analysis.start('raconte une blague')
      }, new AnalyzeError("Excusez-moi, je n'ai pas compris"))
      throws(() => {
        analysis.start('ajoute')
      }, new AnalyzeError('Que souhaitez-vous ajouter ?'))
      throws(() => {
        analysis.start('supprime')
      }, new AnalyzeError('Que souhaitez-vous supprimer ?'))
      throws(() => {
        analysis.start('ajoute une tache')
      }, new AnalyzeError('Quel est le nom de la tâche ?'))
      throws(() => {
        analysis.start('ajoute un tag')
      }, new AnalyzeError('Quel est le nom du tag ?'))
      throws(() => {
        analysis.start('ajoute un tag lambda de couleur')
      }, new AnalyzeError('Quel est la couleur du tag ?'))
      throws(() => {
        analysis.start('ajoute une tache x avec une estimation')
      }, new AnalyzeError('En combien de temps estimez vous finir la tâche ?'))
      throws(() => {
        analysis.start('ajoute une plage horaire')
      }, new AnalyzeError('Voulez-vous ajouter une plage horaire de pause ou de reprise ?'))
      throws(() => {
        analysis.start('ajoute une plage horaire de pause')
      }, new AnalyzeError('A quelle heure ?'))
      throws(() => {
        analysis.start('ajoute une plage horaire de reprise')
      }, new AnalyzeError('A quelle heure ?'))
      throws(() => {
        analysis.start('ajouter une tache avec')
      }, new AnalyzeError('Que souhaitez-vous rajouter à la tâche ?'))
      throws(() => {
        analysis.start('lance une tache')
      }, new AnalyzeError('Quelle tâche souhaitez-vous lancer ?'))
      throws(() => {
        analysis.start('ajoute un tag truc à la tâche')
      }, new AnalyzeError('A quelle tâche souhaitez-vous appliquer le tag ?'))

      throws(() => {
        analysis.start('ajoute une estimation')
      }, new AnalyzeError('En combien de temps estimez vous finir la tâche ?'))

      throws(() => {
        analysis.start('ajoute une estimation a la tache sport')
      }, new AnalyzeError('En combien de temps estimez vous finir la tâche ?'))

      throws(() => {
        analysis.start('ajoute une estimation de 3 heures')
      }, new AnalyzeError('A quelle tâche voulez-vous ajouter cette estimation ?'))
    })
  })

  describe('generation', () => {
    it('parse time', () => {
      equal(generate.parseTime(generate.cleanTime('de')), 0)
      equal(generate.parseTime(generate.cleanTime('2 semaines 3h30 10 secondes')), 1_222_210)
      equal(generate.parseTime(generate.cleanTime('3h30 minutes 10 secondes')), 12_610)
      equal(generate.parseTime(generate.cleanTime('de une semaine 5 jours 2 heures 2 minutes et une seconde')), 1_044_121)
      equal(generate.parseTime(generate.cleanTime('un jour une heure et une minute')), 90_060)
    })
  })

  describe('generation', () => {
    it('parse time', () => {
      equal(generate.parseTime(generate.cleanTime('de')), 0)
      equal(generate.parseTime(generate.cleanTime('2 semaines 3h30 10 secondes')), 1_222_210)
      equal(generate.parseTime(generate.cleanTime('3h30 minutes 10 secondes')), 12_610)
      equal(generate.parseTime(generate.cleanTime('de une semaine 5 jours 2 heures 2 minutes et une seconde')), 1_044_121)
      equal(generate.parseTime(generate.cleanTime('un jour une heure et une minute')), 90_060)
    })
  })

  describe('execution', () => {
    it('basic sentences', () => {
      analysis.reset()
      equal(speechToTextPlugin.execute('ajoute la tache sport'), "J'ajoute la tâche sport")
      equal(speechToTextPlugin.execute('ajoute une estimation de 5h à la tache sport'), "J'ajoute l'estimation à sport")
      equal(speechToTextPlugin.execute('ajoute une estimation de 5h sport'), "J'ajoute l'estimation à sport")
      equal(speechToTextPlugin.execute('ajoute le tag c cool'), "J'ajoute un tag c cool")
      equal(speechToTextPlugin.execute('ajoute le tag c cool à la tache sport'), "J'ajoute le tag c cool à la tâche sport")
      equal(speechToTextPlugin.execute('ajoute le tag c cool à sport'), "J'ajoute le tag c cool à la tâche sport")
      equal(speechToTextPlugin.execute('lance la tache sport'), 'Je lance la tâche sport')
      equal(speechToTextPlugin.execute('stop'), "J'arrête la tâche sport")
      equal(speechToTextPlugin.execute('supprime la tache sport'), 'Je supprime la tâche sport')
      equal(speechToTextPlugin.execute('ajoute la tache nommee musculation avec un tag x'), "J'ajoute la tâche musculation")
      equal(speechToTextPlugin.execute('ajoute la tache t avec un tag x de couleur noir et avec une estimation de 5h30'), "J'ajoute la tâche t")
      equal(speechToTextPlugin.execute('ajoute une etiquette z avec une couleur verte'), "J'ajoute un tag z")
      equal(speechToTextPlugin.execute('supprime le tag x'), 'Je supprime le tag x')
      equal(speechToTextPlugin.execute('supprime la tache musculation et la tache t et le tag z et le tag c cool'), "c'est fait")
      equal(speechToTextPlugin.execute('ajoute une plage horaire de pause à 12h'), "J'ajoute la plage horaire de pause")
      equal(speechToTextPlugin.execute('supprime la plage horaire de pause à 12h'), 'Je supprime la plage horaire de pause')
      equal(speechToTextPlugin.execute('ajoute une plage horaire de reprise à 18h'), "J'ajoute la plage horaire de reprise")
      equal(speechToTextPlugin.execute('supprime la plage horaire de reprise à 18h'), 'Je supprime la plage horaire de reprise')
    })
    it('semantic errors', () => {
      throws(() => {
        speechToTextPlugin.execute('stoppe la tache machin')
      }, new ExecutionError("Aucune tâche n'est lancée"))

      throws(() => {
        speechToTextPlugin.execute('lance la tache machin')
      }, new ExecutionError("La tâche n'existe pas"))

      speechToTextPlugin.execute('ajoute la tache sport')
      speechToTextPlugin.execute('lance la tache sport')

      throws(() => {
        speechToTextPlugin.execute('lance la tache sport')
      }, new ExecutionError('La tâche est déjà lancée'))

      speechToTextPlugin.execute('supprime la tache sport')

      throws(() => {
        speechToTextPlugin.execute('ajoute un tag xx de couleur blanc creme')
      }, new ExecutionError('Je ne connais pas cette couleur.'))

      speechToTextPlugin.execute('supprime le tag xx')

      throws(() => {
        speechToTextPlugin.execute("supprime la tache qui n'existe pas")
      }, new ExecutionError("Cette tâche n'existe pas"))

      throws(() => {
        speechToTextPlugin.execute("supprime le tag qui n'existe pas")
      }, new ExecutionError("Ce tag n'existe pas"))

      speechToTextPlugin.execute('ajoute une plage horaire de pause à 12h')
      throws(() => {
        speechToTextPlugin.execute('ajoute une plage horaire de pause à 12h')
      }, new ExecutionError('La plage horaire existe déjà'))
      speechToTextPlugin.execute('supprime une plage horaire de pause à 12h')
      throws(() => {
        speechToTextPlugin.execute('supprime une plage horaire de pause à 12h')
      }, new ExecutionError("La plage horaire n'existe pas"))

      speechToTextPlugin.execute('ajoute une plage horaire de reprise à 14h')
      throws(() => {
        speechToTextPlugin.execute('ajoute une plage horaire de reprise à 14h')
      }, new ExecutionError('La plage horaire existe déjà'))
      speechToTextPlugin.execute('supprime une plage horaire de reprise à 14h')
      throws(() => {
        speechToTextPlugin.execute('supprime une plage horaire de reprise à 14h')
      }, new ExecutionError("La plage horaire n'existe pas"))

      throws(() => {
        speechToTextPlugin.execute('ajoute le tag la à la tache qui existe pas')
      }, new ExecutionError("La tâche n'existe pas"))
      speechToTextPlugin.execute('supprime le tag la')

      throws(() => {
        speechToTextPlugin.execute('ajoute une estimation de 3h à la tache ZZZ')
      }, new ExecutionError("La tâche n'existe pas"))
    })
  })
})
