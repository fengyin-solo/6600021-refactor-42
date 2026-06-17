import type { Exporter, ExportContent } from '../../types'

export function createTextExporter(): Exporter {
  return {
    format: 'text',
    label: '纯文本',

    export(content: ExportContent): string {
      const lines = content.text.toUpperCase().split('')
      let out = '盲文翻译输出\n\n'
      for (const ch of lines) {
        const dots = content.brailleMap[ch] || []
        out += `${ch} → [${dots.join(',')}] ${content.dotsToUnicode(dots)}\n`
      }
      return out
    },

    getFilename(): string {
      return 'braille-output.txt'
    },
  }
}

export function createJSONExporter(): Exporter {
  return {
    format: 'json',
    label: 'JSON',

    export(content: ExportContent): string {
      const chars = content.text.toUpperCase().split('').map(ch => ({
        char: ch,
        dots: content.brailleMap[ch] || [],
        unicode: content.dotsToUnicode(content.brailleMap[ch] || []),
      }))
      return JSON.stringify({
        originalText: content.text,
        characters: chars,
        brailleUnicode: chars.map(c => c.unicode).join(''),
      }, null, 2)
    },

    getFilename(): string {
      return 'braille-output.json'
    },
  }
}

export function createCSVSExporter(): Exporter {
  return {
    format: 'csv',
    label: 'CSV',

    export(content: ExportContent): string {
      let out = '字符,点位,盲文符号\n'
      const lines = content.text.toUpperCase().split('')
      for (const ch of lines) {
        const dots = content.brailleMap[ch] || []
        out += `"${ch}","${dots.join(';')}","${content.dotsToUnicode(dots)}"\n`
      }
      return out
    },

    getFilename(): string {
      return 'braille-output.csv'
    },
  }
}
