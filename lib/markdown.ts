import { marked } from 'marked';
import Prism from 'prismjs';
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import katex from 'katex';
import mermaid from 'mermaid';

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

// Import core languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';

// Configure marked with GitHub-like options
export const configureMarked = () => {
  marked.setOptions({
    gfm: true,
    breaks: true,
  });
  
  // Initialize Mermaid
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
  });
};

// Parse markdown with safety checks and apply syntax highlighting
export const parseMarkdown = (markdown: string): string => {
  try {
    configureMarked();
    
    // Process LaTeX math expressions BEFORE markdown parsing to prevent conflicts
    const mathPlaceholders: { [key: string]: string } = {};
    let placeholderIndex = 0;
    
    // Process footnotes: [^1]: footnote content
    const footnotes: { [key: string]: string } = {};
    let processedMarkdown = markdown.replace(/^\[(\^[^\]]+)\]: (.+)$/gm, (match, id, content) => {
      footnotes[id] = content.trim();
      return ''; // Remove footnote definitions from content
    });

    // Process footnote references: [^1]
    processedMarkdown = processedMarkdown.replace(/\[(\^[^\]]+)\]/g, (match, id) => {
      if (footnotes[id]) {
        return `<sup class="markdown-footnote-ref"><a href="#footnote-${id.slice(1)}" id="footnote-ref-${id.slice(1)}">${id.slice(1)}</a></sup>`;
      }
      return match;
    });

    // Process definition lists: Term\n: Definition
    processedMarkdown = processedMarkdown.replace(/^([^\n:]+)\n: (.+)$/gm, (match, term, definition) => {
      return `<dl class="markdown-definition-list"><dt class="markdown-definition-term">${term.trim()}</dt><dd class="markdown-definition-desc">${definition.trim()}</dd></dl>`;
    });

    // Process emoji shortcodes: :smile: :rocket: etc.
    const emojiMap: { [key: string]: string } = {
      'smile': '😊', 'rocket': '🚀', '+1': '👍', '-1': '👎', 'heart': '❤️',
      'fire': '🔥', 'star': '⭐', 'thumbsup': '👍', 'thumbsdown': '👎',
      'party': '🎉', 'tada': '🎉', 'wave': '👋', 'eyes': '👀', 'thinking': '🤔',
      'laughing': '😂', 'cry': '😢', 'angry': '😠', 'confused': '😕',
      'cool': '😎', 'wink': '😉', 'stuck_out_tongue': '😛', 'flushed': '😳'
    };
    
    processedMarkdown = processedMarkdown.replace(/:([a-z_+\-]+):/g, (match, emoji) => {
      return emojiMap[emoji] || match;
    });

    // Process block math first: $$...$$
    processedMarkdown = processedMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        });
        const placeholder = `___MATHBLOCK${placeholderIndex}___`;
        mathPlaceholders[placeholder] = rendered;
        placeholderIndex++;
        return placeholder;
      } catch (err) {
        console.warn('LaTeX block rendering failed:', err);
        return match;
      }
    });

    // Process inline math: $...$
    processedMarkdown = processedMarkdown.replace(/\$([^$\n]+)\$/g, (match, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
        const placeholder = `___MATHINLINE${placeholderIndex}___`;
        mathPlaceholders[placeholder] = rendered;
        placeholderIndex++;
        return placeholder;
      } catch (err) {
        console.warn('LaTeX inline rendering failed:', err);
        return match;
      }
    });
    
    let html = marked.parse(processedMarkdown) as string;
    
    // Apply syntax highlighting to code blocks with copy button and language display
    html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
      const decodedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      let highlightedCode = decodedCode;
      
      // Map common language aliases
      const langMap: { [key: string]: string } = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'sh': 'bash',
        'shell': 'bash',
        'yml': 'yaml'
      };
      
      const normalizedLang = langMap[lang] || lang;
      
      if (Prism.languages[normalizedLang]) {
        try {
          highlightedCode = Prism.highlight(decodedCode, Prism.languages[normalizedLang], normalizedLang);
        } catch (err) {
          console.warn('Syntax highlighting failed:', err);
        }
      }
      
      return `
        <div class="markdown-code-block">
          <div class="markdown-code-header">
            <span class="markdown-code-language">${lang}</span>
            <button class="markdown-copy-button" data-code="${encodeURIComponent(decodedCode)}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              Copy
            </button>
          </div>
          <pre class="markdown-pre"><code class="language-${normalizedLang}">${highlightedCode}</code></pre>
        </div>
      `;
    });

    // Handle code blocks without language specification
    html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
      const decodedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      return `
        <div class="markdown-code-block">
          <div class="markdown-code-header">
            <span class="markdown-code-language">text</span>
            <button class="markdown-copy-button" data-code="${encodeURIComponent(decodedCode)}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              Copy
            </button>
          </div>
          <pre class="markdown-pre"><code>${decodedCode}</code></pre>
        </div>
      `;
    });

    // Apply inline code styling
    html = html.replace(/<code>([^<]+)<\/code>/g, '<code class="markdown-code">$1</code>');
    
    // Apply blockquote styling
    html = html.replace(/<blockquote>/g, '<blockquote class="markdown-blockquote">');
    
    // Apply table styling
    html = html.replace(/<table>/g, '<div class="markdown-table-wrapper"><table class="markdown-table">');
    html = html.replace(/<\/table>/g, '</table></div>');
    
    // Apply link styling and external link handling
    html = html.replace(/<a href="([^"]*)"([^>]*)>/g, (match, href, attrs) => {
      const isExternal = href && (href.startsWith('http') || href.startsWith('//'));
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${attrs}${target} class="markdown-link">`;
    });
    
    // Apply heading styling with anchor links
    html = html.replace(/<h([1-6])([^>]*)>(.*?)<\/h\1>/g, (match, level, attrs, text) => {
      const plainText = text.replace(/<[^>]*>/g, '');
      const id = plainText.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
      return `<h${level} id="${id}" class="markdown-heading markdown-h${level}">
        <a href="#${id}" class="markdown-heading-anchor" aria-hidden="true">#</a>
        ${text}
      </h${level}>`;
    });

    // Restore LaTeX math expressions from placeholders - do this BEFORE Mermaid processing
    for (const placeholder in mathPlaceholders) {
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // For block math, wrap in div
      if (placeholder.includes('MATHBLOCK')) {
        const blockMath = `<div class="markdown-math-block">${mathPlaceholders[placeholder]}</div>`;
        html = html.replace(new RegExp(`<p>\\s*${escapedPlaceholder}\\s*</p>`, 'g'), blockMath);
        html = html.replace(new RegExp(escapedPlaceholder, 'g'), blockMath);
      } else {
        // For inline math, wrap in span
        const inlineMath = `<span class="markdown-math-inline">${mathPlaceholders[placeholder]}</span>`;
        html = html.replace(new RegExp(`<p>\\s*${escapedPlaceholder}\\s*</p>`, 'g'), `<p>${inlineMath}</p>`);
        html = html.replace(new RegExp(escapedPlaceholder, 'g'), inlineMath);
      }
    }

    // Process Mermaid diagrams
    html = html.replace(/<div class="markdown-code-block">\s*<div class="markdown-code-header">\s*<span class="markdown-code-language">mermaid<\/span>[\s\S]*?<\/div>\s*<pre class="markdown-pre"><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>\s*<\/div>/g, (match, code) => {
      const cleanCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        return `<div class="markdown-mermaid-block" id="${id}" data-mermaid="${encodeURIComponent(cleanCode.trim())}">${cleanCode.trim()}</div>`;
      } catch (err) {
        console.warn('Mermaid rendering failed:', err);
        return `<pre class="markdown-pre"><code class="language-mermaid">${cleanCode}</code></pre>`;
      }
    });

    // Add footnotes section at the end if there are any footnotes
    if (Object.keys(footnotes).length > 0) {
      html += '<div class="markdown-footnotes"><h3 class="markdown-footnotes-title">Footnotes</h3><ol class="markdown-footnotes-list">';
      for (const [id, content] of Object.entries(footnotes)) {
        const footnoteId = id.slice(1); // Remove the ^ prefix
        html += `<li id="footnote-${footnoteId}" class="markdown-footnote">
          ${content} 
          <a href="#footnote-ref-${footnoteId}" class="markdown-footnote-backref">↩</a>
        </li>`;
      }
      html += '</ol></div>';
    }

    // Sanitize the HTML to prevent XSS
    return DOMPurify.sanitize(html, {
      ADD_ATTR: ['target', 'rel', 'checked', 'disabled', 'type', 'class', 'id', 'href', 'src', 'width', 'height', 'frameborder', 'allowfullscreen', 'data-mermaid'],
      ADD_TAGS: ['input', 'iframe', 'dl', 'dt', 'dd', 'sup', 'ol'],
    });
  } catch (error) {
    console.error('Failed to parse markdown:', error);
    return '<p>Error parsing markdown</p>';
  }
};

// Sample markdown content for demonstration
export const sampleMarkdown = `# GitHub-Style Markdown Renderer

This is a comprehensive markdown renderer that supports all GitHub markdown features.

## Features

### Text Formatting
**Bold text** and *italic text* and ***bold italic text***

### Links and Images
[External Link](https://github.com) opens in new tab
[Internal Link](#code-blocks) stays in same tab

![Sample Image](https://via.placeholder.com/400x200/6366f1/ffffff?text=Markdown+Image)

### Code

Inline \`code\` with highlighting.

\`\`\`javascript
// Syntax highlighted code block
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to the markdown renderer!\`;
}

greetUser('Developer');
\`\`\`

\`\`\`python
# Python example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print([fibonacci(i) for i in range(10)])
\`\`\`

### Mathematical Expressions

Inline math: $E = mc^2$ and $\\alpha + \\beta = \\gamma$

Block math equations:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\begin{bmatrix}
a & b \\\\
c & d
\\end{bmatrix}
\\begin{bmatrix}
x \\\\
y
\\end{bmatrix} = 
\\begin{bmatrix}
ax + by \\\\
cx + dy
\\end{bmatrix}
$$

### UML Diagrams

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process A]
    B -->|No| D[Process B]
    C --> E[End]
    D --> E
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B-->>A: Hello Alice!
    A->>B: How are you?
    B-->>A: I'm good, thanks!
\`\`\`

### Blockquotes

> This is a blockquote
> 
> It can span multiple lines
> 
> > And can be nested

### Lists

#### Unordered Lists
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

#### Ordered Lists
1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
3. Third item

#### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Another incomplete task

### Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headings | ✅ | H1-H6 with anchor links |
| Text formatting | ✅ | Bold, italic, strikethrough |
| Code blocks | ✅ | Syntax highlighting |
| Tables | ✅ | Responsive design |
| Task lists | ✅ | Interactive checkboxes |
| Images | ✅ | Responsive images |

### Horizontal Rule

---

### Footnotes

This text has a footnote[^1] and another one[^2].

[^1]: This is the first footnote.
[^2]: This is the second footnote with more details.

### Definition Lists

Apple
: A red or green fruit

Orange
: A citrus fruit

### Emoji Support

Express yourself with emojis! :smile: :rocket: :+1: :heart: :fire: :star: :party: :wave: :eyes: :thinking: :laughing: :cool: :wink:

### Mixed Content

Here's some **bold text** with \`inline code\` and a [link](https://example.com).

\`\`\`bash
# Terminal commands
npm install marked highlight.js
npm run dev
\`\`\`

> **Note:** This renderer closely mimics GitHub's markdown styling and behavior.

That's it! :tada:`;