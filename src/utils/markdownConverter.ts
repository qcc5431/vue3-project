import TurndownService from 'turndown'

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  hr: '---',
  bulletListMarker: '-',
  emDelimiter: '*',
})

/**
 * HTML转Markdown
 */
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === '') {
    return ''
  }
  return turndownService.turndown(html)
}

/**
 * Markdown转HTML（简单版，实际由MarkdownPreview组件处理）
 */
export function markdownToHtml(markdown: string): string {
  return markdown
}
