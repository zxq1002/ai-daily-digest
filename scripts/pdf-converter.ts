/**
 * PDF Converter Module
 * Converts Markdown to PDF using Playwright
 * Supports Chinese characters and emoji
 */

import { chromium } from 'playwright';
import { writeFile, mkdir, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

/**
 * Convert Markdown to PDF with Chinese and emoji support
 */
export async function convertMarkdownToPDF(
  markdown: string,
  outputPath: string
): Promise<void> {
  const tempHtmlPath = join(tmpdir(), `digest-${Date.now()}.html`);

  try {
    // Generate HTML with Chinese support
    const html = generateHTMLWithChineseSupport(markdown);
    await writeFile(tempHtmlPath, html, 'utf-8');

    // Launch browser
    const browser = await chromium.launch({ headless: true });

    try {
      const page = await browser.newPage();

      // Load HTML and wait for fonts to load
      await page.goto(`file://${tempHtmlPath}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Ensure output directory exists
      await mkdir(dirname(outputPath), { recursive: true });

      // Generate PDF with proper settings for Chinese
      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="font-size: 9px; width: 100%; text-align: center; color: #666; padding: 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', sans-serif;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>
        `,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '25mm',
          left: '20mm'
        }
      });

      console.log(`✅ PDF 已生成: ${outputPath}`);
    } finally {
      await browser.close();
    }
  } finally {
    // Clean up temp file
    try {
      await unlink(tempHtmlPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Generate HTML with full Chinese and emoji support
 */
function generateHTMLWithChineseSupport(markdown: string): string {
  const htmlContent = convertMarkdownToHTML(markdown);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Daily Digest</title>
  <style>
    /* System font stack with comprehensive Chinese and emoji support */
    body {
      font-family:
        /* Apple systems */
        -apple-system, BlinkMacSystemFont,
        /* Windows */
        "Segoe UI",
        /* Chinese fonts - comprehensive coverage */
        "Noto Sans SC", "PingFang SC", "Hiragino Sans GB",
        "Microsoft YaHei", "WenQuanYi Micro Hei",
        /* Emoji fonts */
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
        "Noto Color Emoji", "Android Emoji", "EmojiSymbols",
        /* Fallback */
        sans-serif;
      font-size: 14px;
      line-height: 1.8;
      color: #333;
      max-width: 100%;
      margin: 0;
      padding: 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    /* Emoji specific styling */
    .emoji, [role="img"], .emoji-native {
      font-family:
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
        "Noto Color Emoji", "Android Emoji", "EmojiSymbols";
      font-style: normal;
      font-weight: normal;
      font-size: 1em;
      line-height: 1;
      display: inline-block;
      vertical-align: middle;
    }

    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 12px;
      font-size: 28px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 20px;
      line-height: 1.3;
    }

    h2 {
      color: #34495e;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 20px;
      font-weight: 600;
      border-left: 4px solid #3498db;
      padding-left: 12px;
      line-height: 1.4;
    }

    h3 {
      color: #555;
      font-size: 16px;
      font-weight: 600;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    h4, h5, h6 {
      color: #666;
      font-weight: 600;
      margin-top: 15px;
      margin-bottom: 8px;
    }

    p {
      margin: 10px 0;
    }

    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family:
        "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New",
        "Noto Sans Mono CJK SC", "WenQuanYi Micro Hei Mono", monospace;
      font-size: 12px;
      color: #c7254e;
    }

    pre {
      background: #f8f8f8;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      border: 1px solid #e1e1e1;
      margin: 15px 0;
    }

    pre code {
      background: none;
      padding: 0;
      color: #333;
    }

    strong, b {
      color: #2c3e50;
      font-weight: 600;
    }

    a {
      color: #3498db;
      text-decoration: none;
      word-break: break-all;
    }

    a:hover {
      text-decoration: underline;
    }

    ul, ol {
      padding-left: 24px;
      margin: 10px 0;
    }

    li {
      margin: 6px 0;
    }

    ul ul, ul ol, ol ul, ol ol {
      margin: 5px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
      table-layout: auto;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background: #f5f5f5;
      font-weight: 600;
      color: #2c3e50;
    }

    tr:nth-child(even) {
      background: #fafafa;
    }

    tr:hover {
      background: #f0f0f0;
    }

    blockquote {
      border-left: 4px solid #ddd;
      margin: 15px 0;
      padding: 10px 15px;
      background: #f9f9f9;
      color: #666;
    }

    blockquote p {
      margin: 5px 0;
    }

    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 20px 0;
    }

    /* Print-specific styles */
    @media print {
      body {
        font-size: 12pt;
        line-height: 1.6;
      }

      h1 {
        font-size: 24pt;
        page-break-after: avoid;
      }

      h2, h3, h4 {
        page-break-after: avoid;
      }

      pre, blockquote, table {
        page-break-inside: avoid;
      }

      a {
        color: #333;
        text-decoration: none;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
}

/**
 * Convert Markdown to HTML with full formatting support
 */
function convertMarkdownToHTML(markdown: string): string {
  let html = markdown
    // Fenced code blocks (must be first)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Headers
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Unordered lists
    .replace(/^(\s*)[-*+] (.*$)/gm, '<li>$2</li>')
    // Ordered lists
    .replace(/^(\s*)\d+\. (.*$)/gm, '<li>$2</li>')
    // Blockquotes
    .replace(/^(\s*)> (.*$)/gm, '<blockquote>$2</blockquote>')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr />')
    // Line breaks (preserve empty lines as paragraph separators)
    .replace(/\n\n/g, '</p><p>');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<p>') && !html.startsWith('<pre>') && !html.startsWith('<ul>') && !html.startsWith('<ol>') && !html.startsWith('<blockquote>')) {
    html = '<p>' + html + '</p>';
  }

  // Wrap list items in appropriate lists
  html = html.replace(/(<li>.*?<\/li>\n*)+/g, (match) => {
    return '<ul>' + match + '</ul>';
  });

  return html;
}

// Export for use in digest.ts
export { convertMarkdownToPDF };
