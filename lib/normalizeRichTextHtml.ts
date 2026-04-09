export function normalizeRichTextHtml(html?: string): string {
  if (!html) return "";

  return html
    .replace(/<br\s+class="ProseMirror-trailingBreak"\s*\/?>/g, "")
    .replace(/<p([^>]*)>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/g, "<p$1>&nbsp;</p>");
}
