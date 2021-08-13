import { Intent, IntentName, Tree } from '../../models'

class Generate {
  private sentence = [] as Intent[]

  public start(sentence: Intent[]) {
    this.sentence = [...sentence]
    let tree = new Tree({})
    Tree.count = 0
    tree = this.action(tree)
    return tree
  }

  private action(tree: Tree) {
    switch (this.currentTag()) {
      case 'add': {
        const child = this.newChild(tree)
        this.add(child)
        this.action(tree)
        break
      }
      case 'delete': {
        const child = this.newChild(tree)
        this.delete(child)
        this.action(tree)
        break
      }
      case 'start': {
        const child = this.newChild(tree)
        this.startTask(child)
        this.action(tree)
        break
      }
      case 'stop': {
        const child = this.newChild(tree)
        this.stopTask(child)
        this.action(tree)
        break
      }
    }
    return tree
  }

  private add(tree: Tree) {
    switch (this.currentTag()) {
      case 'tag': {
        this.tag(tree)
        this.add(tree)
        break
      }
      case 'task': {
        this.task(tree)
        this.add(tree)
        break
      }
      case 'estimation': {
        this.estimation(tree)
        this.add(tree)
        break
      }
      case 'timeSlot':
        this.timeSlot(tree)
        this.add(tree)
        break
    }
  }

  private delete(tree: Tree) {
    switch (this.currentTag()) {
      case 'tag': {
        this.tag(tree)
        this.delete(tree)
        break
      }
      case 'task': {
        this.task(tree)
        this.delete(tree)
        break
      }
      case 'timeSlot':
        this.timeSlot(tree)
        this.delete(tree)
    }
  }

  private startTask(tree: Tree) {
    switch (this.currentTag()) {
      case 'task':
        this.sentence.shift()
        this.startTask(tree)
        break
      case 'identifier': {
        const word = this.sentence.shift()?.word ?? ''
        const intent = new Intent({ tag: 'identifier', word })
        this.newChildWithIntent(tree, this.cleanIdentifier(intent))
        break
      }
    }
  }

  private stopTask(tree: Tree) {
    switch (this.currentTag()) {
      case 'task':
        this.sentence.shift()
        this.stopTask(tree)
        break
      case 'identifier': {
        this.sentence.shift()
      }
    }
  }

  private tag(tree: Tree) {
    const child = this.newChild(tree)
    this.name(child)
    this.tagOption(child)
  }

  private task(tree: Tree) {
    const child = this.newChild(tree)
    this.name(child)
    this.taskBindOption(child)
  }

  private timeSlot(tree: Tree) {
    const child = this.newChild(tree)
    this.timeSlotOption(child)
  }

  private timeSlotOption(tree: Tree) {
    switch (this.currentTag()) {
      case 'pause':
      case 'resume': {
        const child = this.newChild(tree)
        this.time(child)
        this.timeSlotOption(tree)
        break
      }
    }
  }

  private taskBindOption(tree: Tree) {
    switch (this.currentTag()) {
      case 'bind': {
        this.sentence.shift()
        this.taskOption(tree)
        this.taskBindOption(tree)
        break
      }
    }
  }

  private taskOption(tree: Tree) {
    switch (this.currentTag()) {
      case 'tag': {
        this.tag(tree)
        this.taskOption(tree)
        break
      }
      case 'estimation': {
        const child = this.newChild(tree)
        this.time(child)
        this.taskOption(tree)
        break
      }
    }
  }

  private estimation(tree: Tree) {
    const child = this.newChild(tree)
    const sec = this.parseTime(this.cleanTime(this.sentence[0].word))
    const childOfChild = this.newChildWithIntent(child, new Intent({ tag: 'time', word: sec + '' }))
    this.sentence.shift()
    if (this.currentTag() === 'to') this.sentence.shift()
    if (this.currentTag() === 'task') this.sentence.shift()
    this.newChild(childOfChild)
  }

  private time(tree: Tree) {
    switch (this.currentTag()) {
      case 'time': {
        const sec = this.parseTime(this.cleanTime(this.sentence[0].word))
        this.newChildWithIntent(tree, new Intent({ tag: 'time', word: sec + '' }))
        this.sentence.shift()
      }
    }
  }

  public parseTime(time: string[], seconds = 0): number | undefined {
    const currentSec = this.parseTimeOption(time)
    return currentSec ? this.parseTime(time, seconds + currentSec) : seconds
  }

  private parseTimeOption(time: string[]) {
    const number = this.parseTimeNumber(time)
    if (number)
      switch (time[0]) {
        case 'semaines':
          time.shift()
          return number * 604_800
        case 'jours':
          time.shift()
          return number * 86_400
        case 'heures':
          time.shift()
          return number * 3600
        case 'minutes':
          time.shift()
          return number * 60
        case 'secondes':
          time.shift()
          return number
      }

    switch (time[0]) {
      case 'semaine':
        time.shift()
        return 604_800
      case 'jour':
        time.shift()
        return 86_400
      case 'heure':
        time.shift()
        return 3600
      case 'minute':
        time.shift()
        return 60
      case 'seconde':
        time.shift()
        return 1
    }
    let totalTime = 0

    const [h, m] = time[0]?.split('h') || [undefined, undefined]
    const hour = Number.parseInt(h)
    const min = Number.parseInt(m)
    if (!hour) return

    time.shift()
    totalTime += hour * 3600

    if (min) {
      totalTime += min * 60
      if (['minute', 'minutes'].includes(time[0])) time.shift()
    }
    return totalTime
  }

  private parseTimeNumber(time: string[]) {
    const number = +time[0]
    if (number) {
      time.shift()
      return number
    }
  }

  private tagOption(tree: Tree) {
    switch (this.currentTag()) {
      case 'color': {
        const child = this.newChild(tree)
        this.newChild(child)
        this.tagOption(tree)
        break
      }
      case 'to': {
        const child = this.newChild(tree)
        if (this.currentTag() === 'task') this.sentence.shift()
        const word = this.sentence.shift()?.word ?? ''
        const intent = new Intent({ tag: 'identifier', word })
        this.newChildWithIntent(child, this.cleanIdentifier(intent))
        this.tagOption(tree)
        break
      }
    }
  }

  private name(tree: Tree) {
    switch (this.currentTag()) {
      case 'naming':
        this.sentence.shift()
        this.name(tree)
        break
      default: {
        const word = this.sentence.shift()?.word ?? ''
        const intent = new Intent({ tag: 'identifier', word })
        this.newChildWithIntent(tree, this.cleanIdentifier(intent))
        break
      }
    }
  }

  public cleanTime(time: string) {
    const result = time.trim().split(' ')
    return result.filter((word: string) => !['a', 'de', 'et', 'un', 'une', 'en'].includes(word))
  }

  private cleanIdentifier(intent: Intent) {
    const identifier = intent.word.split(' ')
    while (['de', 'un', 'et', 'une'].includes(identifier[identifier.length - 1])) identifier.pop()

    intent.word = identifier.join(' ')
    return intent
  }

  private newChild(tree: Tree) {
    const child = new Tree({ intent: this.sentence.shift(), childIndex: tree.childIndex + 1, index: ++Tree.count })
    return tree.add(child)
  }

  private newChildWithIntent(tree: Tree, intent: Intent) {
    const child = new Tree({ intent, childIndex: tree.childIndex + 1, index: ++Tree.count })
    return tree.add(child)
  }

  private currentTag(): IntentName | undefined {
    return this.sentence[0]?.tag
  }
}

export const generate = new Generate()
