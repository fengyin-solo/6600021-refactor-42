import type { TrainingStrategy } from '../../types'
import { BRAILLE_MAP } from '../translator/english-braille'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function createCharToBrailleStrategy(): TrainingStrategy {
  return {
    mode: 'charToBraille',

    generateQuestion(): string {
      return ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    },

    checkAnswer(userAnswer: number[] | string, question: string): boolean {
      const dots = userAnswer as number[]
      const correctDots = BRAILLE_MAP[question] || []
      return JSON.stringify([...dots].sort()) === JSON.stringify([...correctDots].sort())
    },

    getPrompt(question: string): string {
      return `点击下方 6 点阵选择对应盲文`
    },
  }
}

export function createBrailleToCharStrategy(): TrainingStrategy {
  return {
    mode: 'brailleToChar',

    generateQuestion(): string {
      const char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
      return JSON.stringify(BRAILLE_MAP[char] || [])
    },

    checkAnswer(userAnswer: number[] | string, question: string): boolean {
      const answer = (userAnswer as string).toUpperCase()
      const questionDots = JSON.parse(question)
      let correctChar = '?'
      for (const [char, dots] of Object.entries(BRAILLE_MAP)) {
        if (JSON.stringify([...dots].sort()) === JSON.stringify([...questionDots].sort())) {
          correctChar = char
          break
        }
      }
      return answer === correctChar
    },

    getPrompt(question: string): string {
      return `请输入对应的字母`
    },
  }
}

export function createDictationStrategy(): TrainingStrategy {
  const WORDS = ['HELLO', 'WORLD', 'BRAILLE', 'LEARN', 'STUDY', 'MUSIC', 'HAPPY', 'DREAM']

  return {
    mode: 'dictation',

    generateQuestion(): string {
      return WORDS[Math.floor(Math.random() * WORDS.length)]
    },

    checkAnswer(userAnswer: number[] | string, question: string): boolean {
      const answer = (userAnswer as string).toUpperCase()
      return answer === question
    },

    getPrompt(question: string): string {
      return `听写：请输入你听到的单词`
    },
  }
}
