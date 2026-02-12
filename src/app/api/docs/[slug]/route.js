import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const DOCS_MAP = {
    architecture: 'ARCHITECTURE.md',
    srs: 'SRS.md',
    api: 'API.md',
    'er-diagram': 'ER_DIAGRAM.md',
};

export async function GET(_request, context) {
    const slug = context?.params?.slug;
    const fileName = DOCS_MAP[slug];

    if (!fileName) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'docs', fileName);

    try {
        const markdown = await readFile(filePath, 'utf8');
        return new NextResponse(markdown, {
            status: 200,
            headers: {
                'Content-Type': 'text/markdown; charset=utf-8',
                'Cache-Control': 'public, max-age=60',
            },
        });
    } catch {
        return NextResponse.json({ error: 'Failed to read docs file' }, { status: 500 });
    }
}
