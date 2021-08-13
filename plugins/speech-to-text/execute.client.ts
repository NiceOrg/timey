import { tasksPlugin, tagsPlugin } from '..'
import { ExecutionError, Tag, Task, TaskStatus, Tree } from '../../models'
import { timeSlotsPlugin } from '../parameters/time-slots.client'
import { colorNameToHex } from '../../utils'

class Execute {
  private resultMessage: string[] = []

  public start(tree: Tree) {
    this.resultMessage = []
    for (const child of tree.children)
      switch (child.intent.tag) {
        case 'add':
          this.add(child)
          break
        case 'delete':
          this.delete(child)
          break
        case 'start':
          this.startTask(child)
          break
        case 'stop':
          this.stopTask()
          break
      }
    if (this.resultMessage.length === 1) return this.resultMessage[0]
    return "c'est fait"
  }

  public add(tree: Tree) {
    for (const child of tree.children)
      switch (child.intent.tag) {
        case 'task':
          this.addTask(child)
          break
        case 'tag':
          this.addTag(child)
          break
        case 'estimation':
          this.addEstimation(child)
          break
        case 'timeSlot':
          this.addTimeSlot(child)
          break
      }
  }

  public delete(tree: Tree) {
    for (const child of tree.children)
      switch (child.intent.tag) {
        case 'task':
          this.deleteTask(child)
          break
        case 'tag':
          this.deleteTag(child)
          break
        case 'timeSlot':
          this.deleteTimeSlot(child)
          break
      }
  }

  private startTask(tree: Tree) {
    const name = tree.children[0].intent.word
    const taskFound = tasksPlugin.findByName(name)
    if (!taskFound) throw new ExecutionError("La tâche n'existe pas")
    if (taskFound.started === TaskStatus.started) throw new ExecutionError('La tâche est déjà lancée')
    tasksPlugin.toggle(taskFound)
    this.addMessage('Je lance la tâche ' + taskFound.name)
  }

  private stopTask() {
    const activeTask = tasksPlugin.getActiveTask()
    if (!activeTask) throw new ExecutionError("Aucune tâche n'est lancée")
    tasksPlugin.toggle(activeTask)
    this.addMessage("J'arrête la tâche " + activeTask.name)
  }

  private addTask(tree: Tree) {
    const name = tree.children[0].intent.word
    const task = tasksPlugin.add(new Task(-1, name))
    for (let index = 1; index < tree.children.length; index++) {
      const child = tree.children[index]
      switch (child.intent.tag) {
        case 'estimation':
          task.estimation = Number.parseInt(child.children[0].intent.word)
          tasksPlugin.update(task)
          break
        case 'tag': {
          const name = child.children[0].intent.word
          let tag = tagsPlugin.findByName(name)
          if (!tag) tag = tagsPlugin.add(new Tag(-1, name))
          tasksPlugin.addTag(task, tag)
          if (child.children[1]) this.addTagColor(child.children[1].children[0].intent.word, tag)
          break
        }
      }
    }
    this.addMessage("J'ajoute la tâche " + name)
  }

  private addTag(tree: Tree) {
    const name = tree.children[0].intent.word
    let tag = tagsPlugin.findByName(name)
    if (!tag) tag = tagsPlugin.add(new Tag(-1, name))
    for (let index = 1; index < tree.children.length; index++) {
      const child = tree.children[index]
      switch (child.intent.tag) {
        case 'color':
          this.addTagColor(child.children[0].intent.word, tag)
          break
        case 'to': {
          const name = child.children[0].intent.word
          const taskFound = tasksPlugin.findByName(name)
          if (!taskFound) throw new ExecutionError("La tâche n'existe pas")
          tasksPlugin.addTag(taskFound, tag)
          this.addMessage("J'ajoute le tag " + tag.name + ' à la tâche ' + taskFound.name)
          break
        }
      }
    }
    if (this.resultMessage.length === 0) this.addMessage("J'ajoute un tag " + name)
  }

  private addTimeSlot(tree: Tree) {
    for (const child of tree.children)
      switch (child.intent.tag) {
        case 'resume': {
          const sec = 1000 * Number.parseInt(child.children[0].intent.word)
          if (!timeSlotsPlugin.addResume(sec)) throw new ExecutionError('La plage horaire existe déjà')
          this.addMessage("J'ajoute la plage horaire de reprise")
          break
        }
        case 'pause': {
          const sec = 1000 * Number.parseInt(child.children[0].intent.word)
          if (!timeSlotsPlugin.addPause(sec)) throw new ExecutionError('La plage horaire existe déjà')
          this.addMessage("J'ajoute la plage horaire de pause")
          break
        }
      }
  }

  private addEstimation(tree: Tree) {
    const child = tree.children[0]
    const time = child.intent.word
    const name = child.children[0].intent.word
    const taskFound = tasksPlugin.findByName(name)
    if (!taskFound) throw new ExecutionError("La tâche n'existe pas")
    taskFound.estimation = +time
    tasksPlugin.update(taskFound)
    this.addMessage("J'ajoute l'estimation à " + name)
  }

  private addTagColor(color: string, tag: Tag) {
    const hexColor = colorNameToHex(color)
    if (!hexColor) throw new ExecutionError('Je ne connais pas cette couleur.')
    tag.color = hexColor
    tagsPlugin.update(tag)
  }

  private deleteTask(tree: Tree) {
    const name = tree.children[0].intent.word
    const taskFound = tasksPlugin.findByName(name)
    if (!taskFound) throw new ExecutionError("Cette tâche n'existe pas")
    tasksPlugin.delete(taskFound)
    this.addMessage('Je supprime la tâche ' + name)
  }

  private deleteTag(tree: Tree) {
    const name = tree.children[0].intent.word
    const tagFound = tagsPlugin.findByName(name)
    if (!tagFound) throw new ExecutionError("Ce tag n'existe pas")
    tagsPlugin.delete(tagFound)
    this.addMessage('Je supprime le tag ' + name)
  }

  private deleteTimeSlot(tree: Tree) {
    for (const child of tree.children)
      switch (child.intent.tag) {
        case 'resume':
          if (!timeSlotsPlugin.removeResume(+child.children[0].intent.word * 1000)) throw new ExecutionError("La plage horaire n'existe pas")
          this.addMessage('Je supprime la plage horaire de reprise')
          break
        case 'pause':
          if (!timeSlotsPlugin.removePause(+child.children[0].intent.word * 1000)) throw new ExecutionError("La plage horaire n'existe pas")
          this.addMessage('Je supprime la plage horaire de pause')
          break
      }
  }

  addMessage(message: string) {
    this.resultMessage.push(message)
  }
}

export const execute = new Execute()
