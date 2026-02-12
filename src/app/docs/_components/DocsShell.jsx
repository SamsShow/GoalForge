"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import { MarkdownViewer } from './MarkdownViewer';

const NAV_ITEMS = [
    { slug: 'architecture', title: 'Architecture', description: 'System design and verification flow', file: 'ARCHITECTURE.md' },
    { slug: 'srs', title: 'SRS', description: 'Software Requirements Specification', file: 'SRS.md' },
    { slug: 'api', title: 'API', description: 'API endpoints and usage', file: 'API.md' },
    { slug: 'er-diagram', title: 'ER Diagram', description: 'On-chain & off-chain data model', file: 'ER_DIAGRAM.md' },
];

export function DocsShell({ initialSlug = 'architecture', showIndex = false }) {
    const pathname = usePathname();
    const slug = useMemo(() => {
        const parts = (pathname || '').split('/').filter(Boolean);
        if (parts[0] !== 'docs') return initialSlug;
        return parts[1] || initialSlug;
    }, [pathname, initialSlug]);

    const activeItem = NAV_ITEMS.find((i) => i.slug === slug) || NAV_ITEMS[0];

    const [markdown, setMarkdown] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`/api/docs/${slug}`, { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to load documentation');
                const text = await res.text();
                if (!cancelled) setMarkdown(text);
            } catch (e) {
                if (!cancelled) setError(e?.message || 'Failed to load documentation');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [slug]);

    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                <Card className="glass p-0 overflow-hidden">
                    <div className="p-5 border-b border-border/40">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/25 to-accent/10 border border-primary/20 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold leading-none">Documentation</p>
                                <p className="text-xs text-muted-foreground mt-1">STICKIT — project docs</p>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="h-[70vh] lg:h-[calc(100vh-190px)]">
                        <div className="p-3 space-y-2">
                            {NAV_ITEMS.map((item) => {
                                const active = item.slug === activeItem.slug;
                                return (
                                    <Link key={item.slug} href={`/docs/${item.slug}`}>
                                        <div
                                            className={
                                                "rounded-xl p-4 border transition-all " +
                                                (active
                                                    ? "bg-secondary/60 border-primary/25"
                                                    : "bg-transparent border-border/40 hover:bg-secondary/40 hover:border-primary/15")
                                            }
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className={"font-semibold " + (active ? "text-foreground" : "text-foreground")}>{item.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                                </div>
                                                <FileText className={"h-4 w-4 mt-0.5 " + (active ? "text-primary" : "text-muted-foreground")} />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}

                            {showIndex && (
                                <div className="pt-2">
                                    <Link href="/docs">
                                        <Button variant="secondary" className="w-full glass hover:bg-secondary/80">
                                            Docs Home
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                <Card className="glass p-6 overflow-hidden">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{activeItem.title}</h1>
                            <p className="text-sm text-muted-foreground mt-2">{activeItem.description}</p>
                        </div>
                        <Link
                            href={`https://github.com/SamsShow/GoalForge/blob/main/docs/${activeItem.file}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button variant="secondary" className="glass hover:bg-secondary/80 gap-2">
                                <ExternalLink className="h-4 w-4" />
                                View on GitHub
                            </Button>
                        </Link>
                    </div>

                    <div className="max-w-none">
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-7 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-11/12" />
                                <Skeleton className="h-4 w-10/12" />
                                <Skeleton className="h-40 w-full" />
                            </div>
                        ) : error ? (
                            <div className="rounded-xl border border-border/50 bg-secondary/40 p-5">
                                <p className="font-semibold">Couldn’t load this document</p>
                                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                            </div>
                        ) : (
                            <MarkdownViewer markdown={markdown} />
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
