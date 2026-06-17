export interface BrailleChar {
  char: string
  dots: number[]
  unicode: string
}

export type LearnMode = 'charToBraille' | 'brailleToChar' | 'dictation'

export interface Score {
  correct: number
  total: number
}

export interface HistoryItem {
  input: string
  correct: boolean
}

export interface Translator {
  textToBraille(text: string): number[][]
  brailleToText(dots: number[]): string
  dotsToUnicode(dots: number[]): string
  getMap(): Record<string, number[]>
}

export interface TrainingStrategy {
  mode: LearnMode
  generateQuestion(): string
  checkAnswer(userAnswer: number[] | string, question: string): boolean
  getPrompt(question: string): string
}

export interface Exporter {
  format: string
  label: string
  export(content: ExportContent): string
  getFilename(): string
}

export interface ExportContent {
  text: string
  brailleMap: Record<string, number[]>
  dotsToUnicode: (dots: number[]) => string
}
