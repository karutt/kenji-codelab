import { Client } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

interface CodeSubmissionRequest {
    title: string;
    code: string;
    name: string;
    index: number;
    language: string;
    articleSlug: string;
    bookSlug: string;
}

export async function POST(request: NextRequest) {
    try {
        console.log('Code submission API called');
        const body: CodeSubmissionRequest = await request.json();
        console.log('Request body:', {
            ...body,
            code: body.code?.substring(0, 100) + '...',
        });

        // Validate required fields
        if (
            !body.title ||
            !body.code ||
            !body.name ||
            !body.language ||
            !body.articleSlug ||
            !body.bookSlug
        ) {
            console.error('Missing required fields:', {
                title: !!body.title,
                code: !!body.code,
                name: !!body.name,
                language: !!body.language,
                articleSlug: !!body.articleSlug,
                bookSlug: !!body.bookSlug,
            });
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Submit to Notion
        console.log('Submitting to Notion...');
        await addCodeToNotion(body);
        console.log('Submission successful');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Code submission error:', error);
        return NextResponse.json({ error: 'Failed to submit code' }, { status: 500 });
    }
}

async function addCodeToNotion({
    title,
    code,
    name,
    index,
    language,
    articleSlug,
    bookSlug,
}: CodeSubmissionRequest): Promise<void> {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_CODE_SUBMISSION_DATABASE_ID;

    console.log('Notion configuration:', {
        hasApiKey: !!apiKey,
        hasDatabaseId: !!databaseId,
        databaseId: databaseId?.substring(0, 8) + '...',
    });

    if (!apiKey) {
        throw new Error('NOTION_API_KEY is not configured');
    }

    if (!databaseId) {
        throw new Error('NOTION_CODE_SUBMISSION_DATABASE_ID is not configured');
    }

    const notion = new Client({ auth: apiKey });

    console.log('Creating Notion page with properties:', {
        title,
        name,
        language,
        bookSlug,
        articleSlug,
        index,
        codeLength: code.length,
    });

    try {
        const result = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Title: {
                    title: [
                        {
                            text: {
                                content: articleSlug + '-' + index,
                            },
                        },
                    ],
                },
                Name: {
                    rich_text: [
                        {
                            text: {
                                content: name,
                            },
                        },
                    ],
                },
                Section: {
                    rich_text: [
                        {
                            text: {
                                content: articleSlug,
                            },
                        },
                    ],
                },
                Book: {
                    rich_text: [
                        {
                            text: {
                                content: bookSlug,
                            },
                        },
                    ],
                },
                Index: {
                    number: index,
                },
            },
            children: [
                {
                    object: 'block',
                    type: 'code',
                    code: {
                        rich_text: [{ type: 'text', text: { content: code } }],
                        language: 'python',
                        caption: [],
                    },
                },
            ],
        });

        console.log('Notion page created successfully:', result.id);
    } catch (notionError) {
        console.error('Notion API error:', notionError);
        const errorMessage = notionError instanceof Error ? notionError.message : 'Unknown error';
        throw new Error(`Notion API error: ${errorMessage}`);
    }
}
