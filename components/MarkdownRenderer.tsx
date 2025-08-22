import React, { useEffect, useRef } from 'react';
import { parseMarkdown } from '@/lib/markdown';
import { cn } from '@/lib/utils';
import mermaid from 'mermaid';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  const htmlContent = parseMarkdown(content);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle checkbox interactions for task lists
    const handleCheckboxClick = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.type === 'checkbox' && target.className.includes('markdown-checkbox')) {
        // Toggle the checked state visually (read-only interaction)
        const listItem = target.closest('.markdown-task-item');
        if (listItem) {
          listItem.classList.toggle('checked');
        }
      }
    };

    // Handle heading anchor clicks for smooth scrolling
    const handleAnchorClick = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.className.includes('markdown-heading-anchor')) {
        event.preventDefault();
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
          const element = document.getElementById(href.slice(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Update URL without triggering navigation
            window.history.pushState(null, '', href);
          }
        }
      }
    };

    // Handle copy button clicks
    const handleCopyClick = async (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('.markdown-copy-button') as HTMLButtonElement;
      if (button) {
        event.preventDefault();
        const code = button.getAttribute('data-code');
        if (code) {
          try {
            const decodedCode = decodeURIComponent(code);
            await navigator.clipboard.writeText(decodedCode);
            
            // Provide visual feedback
            const originalText = button.innerHTML;
            button.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              Copied!
            `;
            
            setTimeout(() => {
              button.innerHTML = originalText;
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
          }
        }
      }
    };

    // Render Mermaid diagrams
    const renderMermaidDiagrams = async () => {
      const container = containerRef.current;
      if (!container) return;

      const mermaidElements = container.querySelectorAll('.markdown-mermaid-block[data-mermaid]');
      
      for (const element of mermaidElements) {
        const mermaidCode = decodeURIComponent(element.getAttribute('data-mermaid') || '');
        const id = element.id;
        
        try {
          const { svg } = await mermaid.render(id + '-svg', mermaidCode);
          element.innerHTML = svg;
          element.removeAttribute('data-mermaid');
        } catch (err) {
          console.warn('Mermaid rendering failed:', err);
          element.innerHTML = `<pre><code>${mermaidCode}</code></pre>`;
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleCheckboxClick);
      container.addEventListener('click', handleAnchorClick);
      container.addEventListener('click', handleCopyClick);
      
      // Render Mermaid diagrams after a short delay to ensure DOM is ready
      setTimeout(renderMermaidDiagrams, 100);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleCheckboxClick);
        container.removeEventListener('click', handleAnchorClick);
        container.removeEventListener('click', handleCopyClick);
      }
    };
  }, [htmlContent]);

  return (
    <div
      ref={containerRef}
      className={cn('markdown-content', className)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;