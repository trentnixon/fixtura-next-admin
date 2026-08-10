"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugifyHeading } from "../../_components/slugifyHeading";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="scroll-mt-20 text-3xl font-bold tracking-tight first:mt-0 mt-8">
      {children}
    </h1>
  ),
  h2: ({ children }) => {
    const text = String(children);
    const id = slugifyHeading(text);
    return (
      <h2
        id={id}
        className="scroll-mt-20 border-b border-slate-200 pb-2 text-xl font-semibold mt-10 mb-3"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = String(children);
    const id = slugifyHeading(text);
    return (
      <h3
        id={id}
        className="scroll-mt-20 text-lg font-semibold mt-6 mb-2"
      >
        {children}
      </h3>
    );
  },
  p: ({ children }) => (
    <p className="text-sm leading-relaxed text-slate-700">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-1 pl-6 text-sm text-slate-700">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1 pl-6 text-sm text-slate-700">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-800"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
      {children}
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline-offset-2 hover:underline"
    >
      {children}
    </a>
  ),
};

/**
 * Renders LLM_COMPONENT_GUIDE.md with GFM support and heading anchors for deep links.
 */
export function GuideMarkdown({ content }: { content: string }) {
  return (
    <article className="prose prose-slate max-w-none prose-headings:scroll-mt-20">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
