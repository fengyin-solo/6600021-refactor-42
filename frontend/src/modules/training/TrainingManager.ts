import type { TrainingStrategy, LearnMode, Score, HistoryItem } from '../../types'
import { createCharToBrailleStrategy, createBrailleToCharStrategy, createDictationStrategy } from './strategies'

export class TrainingManager {
  private strategies: Map<LearnMode, TrainingStrategy> = new Map()
  private currentMode: LearnMode
  private currentQuestion: string = ''
  private score: Score = { correct: 0, total: 0 }
  private history: HistoryItem[] = []

  constructor(defaultMode: LearnMode = 'charToBraille') {
    this.registerStrategy(createCharToBrailleStrategy())
    this.registerStrategy(createBrailleToCharStrategy())
    this.registerStrategy(createDictationStrategy())
    this.currentMode = defaultMode
  }

  registerStrategy(strategy: TrainingStrategy): void {
    this.strategies.set(strategy.mode, strategy)
  }

  setMode(mode: LearnMode): void {
    if (!this.strategies.has(mode)) {
      throw new Error(`Training mode "${mode}" not found`)
    }
    this.currentMode = mode
  }

  getMode(): LearnMode {
    return this.currentMode
  }

  generateQuestion(): string {
    const strategy = this.strategies.get(this.currentMode)!
    this.currentQuestion = strategy.generateQuestion()
    return this.currentQuestion
  }

  getCurrentQuestion(): string {
    return this.currentQuestion
  }

  checkAnswer(userAnswer: number[] | string): boolean {
    const strategy = this.strategies.get(this.currentMode)!
    const correct = strategy.checkAnswer(userAnswer, this.currentQuestion)

    this.score.total++
    if (correct) this.score.correct++
    this.history.unshift({ input: this.currentQuestion, correct })

    return correct
  }

  getPrompt(): string {
    const strategy = this.strategies.get(this.currentMode)!
    return strategy.getPrompt(this.currentQuestion)
  }

  getScore(): Score {
    return { ...this.score }
  }

  getHistory(): HistoryItem[] {
    return [...this.history]
  }

  resetScore(): void {
    this.score = { correct: 0, total: 0 }
    this.history = []
  }

  getAvailableModes(): LearnMode[] {
    return Array.from(this.strategies.keys())
  }
}
