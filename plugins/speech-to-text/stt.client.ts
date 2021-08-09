// https://www.section.io/engineering-educationspeech-recognition-in-javascript/
// https://stackoverflow.com/questions/38087013/angular2-web-speech-api-voice-recognition

/* eslint-disable no-undef */
import { emit } from 'shuutils'
import { SpeechRequest } from '../../models'
import { parametersPlugin, analysis } from '../'
import { STT_RESULT } from '../events.client'

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
    recognition.onspeechend = () => this.end()
    this.recognition = recognition
  }

  /* istanbul ignore next */
  public result(sentence: string) {
    const speechRequest = new SpeechRequest({ sentence })
    emit(STT_RESULT, speechRequest)
    this.end()
  }

  /* istanbul ignore next */
  public start() {
    this.recognition.start()
  }

  /* istanbul ignore next */
  public end() {
    this.recognition.stop()
  }

  public execute(sentence: string) {
    const intents = analysis.analyze(sentence, true)
    console.log(intents)
    return 'WORK IN PROGRESS'
  }
}

export const speechToTextPlugin = new SpeechToTextPlugin()
