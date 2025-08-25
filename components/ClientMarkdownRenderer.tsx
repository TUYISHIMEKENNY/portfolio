'use client'

import React from 'react'
import MarkdownContentWithCopy from './MarkdownContentWithCopy'

interface ClientMarkdownRendererProps {
  htmlContent: string
  rawMarkdown: string
}

const ClientMarkdownRenderer: React.FC<ClientMarkdownRendererProps> = ({ htmlContent, rawMarkdown }) => {
  return <MarkdownContentWithCopy htmlContent={htmlContent} rawMarkdown={rawMarkdown} />
}

export default ClientMarkdownRenderer
