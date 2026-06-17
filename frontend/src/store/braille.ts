import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { createEnglishBrailleTranslator, BRAILLE_MAP } from '../modules/translator'
import { TrainingManager } from '../modules/training'
import { ExportManager } from '../modules/exporter'
import type { LearnMode, Score, HistoryItem } from '../types'

const translator = createEnglishBrailleTranslator()
const trainingManager = new TrainingManager('charToBraille')
const exportManager = new ExportManager('text')

export const useBrailleStore = defineStore('braille', () => {
  const inputText = ref('')
  const brailleOutput = ref<number[][]>([])
  const learnMode = ref<LearnMode>('charToBraille')
  const quizChar = ref('')
  const selectedDots = ref<number[]>([])
  const score = ref<Score>({ correct: 0, total: 0 })
  const history = ref<HistoryItem[]>([])

  const brailleUnicode = computed(() =>
    brailleOutput.value.map(d => translator.dotsToUnicode(d)).join('')
  )

  function translate() {
    brailleOutput.value = translator.textToBraille(inputText.value)
  }

  function reverseTranslate() {
    return translator.brailleToText(selectedDots.value)
  }

  function generateQuiz() {
    quizChar.value = trainingManager.generateQuestion()
    selectedDots.value = []
    syncScoreAndHistory()
  }

  function toggleDot(dot: number) {
    const idx = selectedDots.value.indexOf(dot)
    if (idx >= 0) selectedDots.value.splice(idx, 1)
    else selectedDots.value.push(dot)
  }

  function checkQuizAnswer() {
    const userAnswer = learnMode.value === 'charToBraille' ? selectedDots.value : ''
    const correct = trainingManager.checkAnswer(userAnswer)
    syncScoreAndHistory()
    if (navigator.vibrate) navigator.vibrate(correct ? 100 : [100, 50, 100])
    generateQuiz()
  }

  function resetScore() {
    trainingManager.resetScore()
    syncScoreAndHistory()
  }

  function syncScoreAndHistory() {
    score.value = trainingManager.getScore()
    history.value = trainingManager.getHistory()
  }

  function setLearnMode(mode: LearnMode) {
    learnMode.value = mode
    trainingManager.setMode(mode)
    quizChar.value = ''
    selectedDots.value = []
  }

  function exportPDF(): string {
    return exportManager.export({
      text: inputText.value,
      brailleMap: translator.getMap(),
      dotsToUnicode: translator.dotsToUnicode.bind(translator),
    })
  }

  function getExportFilename(): string {
    return exportManager.getFilename()
  }

  function getAvailableExportFormats(): { format: string; label: string }[] {
    return exportManager.getAvailableFormats()
  }

  function setExportFormat(format: string) {
    exportManager.setDefaultFormat(format)
  }

  return {
    inputText, brailleOutput, learnMode, quizChar, selectedDots, score, history,
    brailleUnicode, translate, reverseTranslate, generateQuiz, toggleDot,
    checkQuizAnswer, resetScore, exportPDF, setLearnMode,
    getExportFilename, getAvailableExportFormats, setExportFormat
  }
})
