import type { Exporter, ExportContent } from '../../types'
import { createTextExporter, createJSONExporter, createCSVSExporter } from './formatters'

export class ExportManager {
  private exporters: Map<string, Exporter> = new Map()
  private defaultFormat: string

  constructor(defaultFormat: string = 'text') {
    this.registerExporter(createTextExporter())
    this.registerExporter(createJSONExporter())
    this.registerExporter(createCSVSExporter())
    this.defaultFormat = defaultFormat
  }

  registerExporter(exporter: Exporter): void {
    this.exporters.set(exporter.format, exporter)
  }

  setDefaultFormat(format: string): void {
    if (!this.exporters.has(format)) {
      throw new Error(`Export format "${format}" not found`)
    }
    this.defaultFormat = format
  }

  export(content: ExportContent, format?: string): string {
    const fmt = format || this.defaultFormat
    const exporter = this.exporters.get(fmt)
    if (!exporter) {
      throw new Error(`Export format "${fmt}" not found`)
    }
    return exporter.export(content)
  }

  getFilename(format?: string): string {
    const fmt = format || this.defaultFormat
    const exporter = this.exporters.get(fmt)
    if (!exporter) {
      throw new Error(`Export format "${fmt}" not found`)
    }
    return exporter.getFilename()
  }

  getAvailableFormats(): { format: string; label: string }[] {
    return Array.from(this.exporters.values()).map(e => ({
      format: e.format,
      label: e.label,
    }))
  }
}
