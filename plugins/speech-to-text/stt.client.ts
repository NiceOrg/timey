// https://www.section.io/engineering-educationspeech-recognition-in-javascript/
// https://stackoverflow.com/questions/38087013/angular2-web-speech-api-voice-recognition

/* eslint-disable no-undef */
import { emit } from 'shuutils'
import { SpeechRequest } from '../../models'
import { parametersPlugin, analysis, generate, execute, STT_RESULT } from '../'

class SpeechToTextPlugin {
  public recognition = {} as SpeechRecognition

  public constructor() {
    this.load()
  }

  /* istanbul ignore next */
  private async load() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition: SpeechRecognition = new SpeechRecognition()
    recognition.interimResults = false
    await parametersPlugin.load()
    recognition.lang = parametersPlugin.getParameters().language
    recognition.onresult = (event) => this.result(event.results[event.results.length - 1][0].transcript)
    recognition.onspeechend = () => this.end('onspeechend')
    this.recognition = recognition
  }

  /* istanbul ignore next */
  public result(sentence: string) {
    const speechRequest = new SpeechRequest({ sentence })
    emit(STT_RESULT, speechRequest)
  }

  /* istanbul ignore next */
  public start() {
    console.log('start recognition')
    this.recognition.start()
  }

  /* istanbul ignore next */
  public end(reason: string) {
    console.log('stop recognition:', reason)
    this.recognition.stop()
  }

  public executeIntents(sentence: string) {
    const intents = analysis.start(sentence, true)
    const tree = generate.start(intents)
    return execute.start(tree)
  }
}

export const speechToTextPlugin = new SpeechToTextPlugin()
