// https://www.section.io/engineering-educationspeech-recognition-in-javascript/
// https://stackoverflow.com/questions/38087013/angular2-web-speech-api-voice-recognition

/* eslint-disable no-undef */
import { emit, sleep } from 'shuutils'
import { SpeechRequest } from '../../models'
import { parametersPlugin, analysis, generate, execute, STT_RESULT, STT_END } from '../'

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
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    recognition.onerror = () => this.end()
    this.recognition = recognition
  }

  /* istanbul ignore next */
  public result(sentence: string) {
    const speechRequest = new SpeechRequest({ sentence })
    emit(STT_RESULT, speechRequest)
  }

  /* istanbul ignore next */
  public async start() {
    await sleep(10)
    this.recognition.start()
  }

  /* istanbul ignore next */
  public end() {
    emit(STT_END)
    this.recognition.stop()
  }

  public executeIntents(sentence: string) {
    const intents = analysis.start(sentence, true)
    const tree = generate.start(intents)
    return execute.start(tree)
  }
}

export const speechToTextPlugin = new SpeechToTextPlugin()
