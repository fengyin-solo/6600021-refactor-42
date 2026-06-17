import { createEnglishBrailleTranslator, BRAILLE_MAP, DOT_POSITIONS } from '../modules/translator'

const translator = createEnglishBrailleTranslator()

export { BRAILLE_MAP, DOT_POSITIONS }

export function textToBraille(text: string): number[][] {
  return translator.textToBraille(text)
}

export function brailleToText(dots: number[]): string {
  return translator.brailleToText(dots)
}

export function dotsToUnicode(dots: number[]): string {
  return translator.dotsToUnicode(dots)
}
