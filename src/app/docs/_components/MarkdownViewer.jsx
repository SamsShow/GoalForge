"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownComponents = {
    h1: (props) => (
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" {...props} />
    ),
    h2: (props) => (
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-10 mb-3" {...props} />
    ),
    h3: (props) => (
        <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-2" {...props} />
    ),
    h4: (props) => (
        <h4 className="text-lg font-semibold mt-6 mb-2" {...props} />
    ),
    p: (props) => (
        <p className="text-muted-foreground leading-relaxed mb-4" {...props} />
    ),
    a: (props) => (
        <a className="text-primary hover:underline" target="_blank" rel="noreferrer" {...props} />
    ),
    ul: (props) => (
        <ul className="list-disc pl-6 space-y-2 mb-4 text-muted-foreground" {...props} />
    ),
    ol: (props) => (
        <ol className="list-decimal pl-6 space-y-2 mb-4 text-muted-foreground" {...props} />
    ),
    li: (props) => <li className="leading-relaxed" {...props} />,
    hr: (props) => <hr className="border-border/50 my-8" {...props} />,
    blockquote: (props) => (
        <blockquote
            className="border-l-2 border-primary/40 pl-4 my-4 text-muted-foreground"
            {...props}
        />
    ),
    code: ({ inline, children, ...props }) => {
        if (inline) {
            return (
                <code
                    className="px-1.5 py-0.5 rounded bg-secondary/70 border border-border/50 text-foreground text-sm"
                    {...props}
                >
                    {children}
                </code>
            );
        }

        return (
            <code
                className="block whitespace-pre overflow-x-auto p-4 rounded-lg bg-secondary/60 border border-border/50 text-sm text-foreground"
                {...props}
            >
                {children}
            </code>
        );
    },
    table: (props) => (
        <div className="overflow-x-auto my-6">
            <table className="w-full text-sm border border-border/50 rounded-lg" {...props} />
        </div>
    ),
    thead: (props) => <thead className="bg-secondary/60" {...props} />,
    th: (props) => (
        <th className="text-left font-semibold text-foreground p-3 border-b border-border/50" {...props} />
    ),
    td: (props) => (
        <td className="p-3 align-top text-muted-foreground border-b border-border/30" {...props} />
    ),
};

export function MarkdownViewer({ markdown }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {markdown}
        </ReactMarkdown>
    );
}
