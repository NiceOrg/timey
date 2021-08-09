import { Intent, Intents, AnalyzeError } from '../../models'

class Analysis {
  private intents = [] as Intent[]
  private sentenceLeft = '' as string
  private sentenceRed = '' as string
  private intentData = new Intents({})

  public analyze(sentence: string, sequential = false) {
    if (sequential) sentence = this.secondary(sentence)
    this.reset()
    this.sentenceLeft = this.cleanSentence(sentence)
    this.action()
    this.sentenceRed = ''
    this.sentenceLeft = ''
    return this.intents
  }

  private secondary(sentence: string) {
    return analysis.sentenceRed.length > 0 ? analysis.sentenceRed.trim() + ' ' + sentence : sentence
  }

  public reset() {
    this.intents = []
    this.sentenceRed = ''
    this.sentenceLeft = ''
  }

  private action(exist = false): boolean {
    if (this.add() || this.delete() || this.startTask() || this.stopTask()) return this.action(true)
    if (!exist) {
      this.reset()
      throw new AnalyzeError("Excusez-moi, je n'ai pas compris")
    }
    return true
  }

  private add() {
    if (!this.addIntent('add')) return false
    if (!this.addSpecs()) throw new AnalyzeError('Que souhaitez-vous ajouter ?')
    return true
  }

  private delete() {
    if (!this.addIntent('delete')) return false
    if (!this.deleteSpecs()) throw new AnalyzeError('Que souhaitez-vous supprimer ?')
    return true
  }

  private startTask() {
    if (!this.addIntent('start')) return false
    this.addIntent('task')
    if (!this.naming()) throw new AnalyzeError('Quelle tâche souhaitez-vous lancer ?')
    return true
  }

  private stopTask() {
    if (!this.addIntent('stop')) return false
    this.addIntent('task')
    this.naming()
    return true
  }

  private addSpecs(exist = false): boolean {
    if (this.task() || this.tag() || this.timeSlot() || this.estimation()) return this.addSpecs(true)
    return exist
  }

  private deleteSpecs(exist = false): boolean {
    if (this.task() || this.tag() || this.timeSlot()) return this.deleteSpecs(true)
    return exist
  }

  private task() {
    if (!this.addIntent('task')) return false
    if (!this.naming()) throw new AnalyzeError('Quel est le nom de la tâche ?')
    this.taskBind()
    return true
  }

  private naming() {
    this.addIntentOfNextWord('naming')
    if (!this.identifier()) return false
    return true
  }

  private taskBind() {
    if (!this.addIntentOfNextWord('bind')) return false
    if (!this.taskOption()) throw new AnalyzeError('Que souhaitez-vous rajouter à la tâche ?')
    return true
  }

  private taskOption(exist = false): boolean {
    if (this.tag() || this.estimation(true)) return this.taskOption(true)
    if (!exist) return false
    this.taskBind()
    return true
  }

  private tag() {
    if (!this.addIntent('tag')) return false
    if (!this.naming()) throw new AnalyzeError('Quel est le nom du tag ?')
    if (this.findIntentOfNextWord('and')) return true
    this.tagOption()
    return true
  }

  private tagOption() {
    if (this.tagtoTask() || this.tagColor()) this.tagOption()
  }

  private tagtoTask() {
    if (!this.addIntentOfNextWord('to')) return false
    this.addIntent('task')
    if (!this.identifier()) throw new AnalyzeError('A quelle tâche souhaitez-vous appliquer le tag ?')
    return true
  }

  private tagColor() {
    if (!this.addIntent('color')) return false
    if (!this.identifier()) throw new AnalyzeError('Quel est la couleur du tag ?')
    return true
  }

  private estimation(taskAssigned = false) {
    if (!this.addIntent('estimation')) return false
    if (this.findIntentOfNextWord('to')) throw new AnalyzeError('En combien de temps estimez vous finir la tâche ?')
    if (!this.time()) throw new AnalyzeError('En combien de temps estimez vous finir la tâche ?')
    if (!taskAssigned) {
      this.addIntentOfNextWord('to')
      this.addIntent('task')
      if (!this.identifier()) throw new AnalyzeError('A quelle tâche voulez-vous ajouter cette estimation ?')
    }
    return true
  }

  private timeSlot() {
    if (!this.addIntent('timeSlot')) return false
    if (!this.timeSlotSpecs()) throw new AnalyzeError('Voulez-vous ajouter une plage horaire de pause ou de reprise ?')
    return true
  }

  private timeSlotSpecs(exist = false): boolean {
    if (this.timeSlotPause() || this.timeSlotResume()) return this.timeSlotSpecs(true)
    return exist
  }

  private timeSlotPause() {
    if (!this.addIntent('pause')) return false
    if (!this.time()) throw new AnalyzeError('A quelle heure ?')
    return true
  }

  private timeSlotResume() {
    if (!this.addIntent('resume')) return false
    if (!this.time()) throw new AnalyzeError('A quelle heure ?')
    return true
  }

  private time() {
    if (this.addIntent('time', false)) return true
    return false
  }

  private identifier() {
    return this.addIntent('identifier')
  }

  private addIntent(tag: string, separateAnd = true) {
    const sentenceToAnalyse = separateAnd ? this.separateIntentsWithAnd() : this.sentenceLeft
    if (!sentenceToAnalyse) return
    const pattern = '(?<' + tag + '>' + this.intentData.get(tag)!.join('|') + ')'
    const intent = new RegExp(pattern).exec(sentenceToAnalyse)?.groups
    if (!intent) return false
    const word = Object.values(intent)[0].trim()
    this.intents.push(new Intent({ tag, word }))
    this.sentenceRed += ' ' + word
    this.sentenceLeft = this.sentenceLeft.slice(this.sentenceLeft.indexOf(word) + word.length)
    return true
  }

  private separateIntentsWithAnd() {
    return /.+?(?= et |ainsi que| a |$)/.exec(this.sentenceLeft)?.shift()
  }

  private addIntentOfNextWord(tag: string) {
    const word = this.findIntentOfNextWord(tag)
    if (!word) return false
    this.intents.push(new Intent({ tag, word }))
    this.sentenceRed += ' ' + word
    this.sentenceLeft = this.sentenceLeft.slice(this.sentenceLeft.indexOf(word) + word.length)
    return true
  }

  private findIntentOfNextWord(tag: string) {
    const word = this.sentenceLeft.trim().split(' ')[0]
    if (!this.intentData.get(tag)!.includes(word)) return false
    return word
  }

  private cleanSentence(sentence: string) {
    return sentence
      .replace(/'/g, ' ')
      .normalize('NFD')
      .replace(/[^\s\w]/gi, '')
      .replace(/\s\s+/g, ' ')
      .toLowerCase()
  }
}

export const analysis = new Analysis()
