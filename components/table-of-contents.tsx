'use client';

import { useEffect, useState } from 'react';
import { TableOfContentsItem } from '@/lib/table-of-contents';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    );

    const headingElements = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No headings found in this article.
      </p>
    );
  }

  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={cn(
            "block w-full text-left text-sm transition-colors hover:text-primary",
            "border-l-2 border-transparent pl-3 py-1",
            item.level === 1 && "font-medium",
            item.level === 2 && "pl-3",
            item.level === 3 && "pl-5",
            item.level === 4 && "pl-7",
            item.level === 5 && "pl-9",
            item.level === 6 && "pl-11",
            activeId === item.id
              ? "text-primary border-l-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.text}
        </button>
      ))}
    </nav>
  );
}