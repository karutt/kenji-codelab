// notion/actions.ts
'use server';

import notion from './notion'; // Notionクライアントをインポート

interface CodeData {
    title: string;
    code: string;
    name: string;
    index: number;
    language: string;
    articleSlug: string;
    bookSlug: string;
}

export async function addCodeToNotion(data: CodeData) {
    try {
        console.log('Attempting to submit to Notion:', {
            title: data.articleSlug + '-' + data.index,
            name: data.name,
            articleSlug: data.articleSlug,
            bookSlug: data.bookSlug,
            index: data.index,
            language: data.language,
            codeLength: data.code.length,
        });

        const databaseId = process.env.NOTION_DATABASE_ID;

        if (!databaseId) {
            throw new Error('NOTION_DATABASE_ID is not configured');
        }

        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Title: {
                    title: [
                        {
                            text: {
                                content: data.articleSlug + '-' + data.index,
                            },
                        },
                    ],
                },
                Name: {
                    rich_text: [
                        {
                            text: {
                                content: data.name,
                            },
                        },
                    ],
                },
                Section: {
                    rich_text: [
                        {
                            text: {
                                content: data.articleSlug,
                            },
                        },
                    ],
                },
                Book: {
                    rich_text: [
                        {
                            text: {
                                content: data.bookSlug,
                            },
                        },
                    ],
                },
                Index: {
                    number: data.index,
                },
            },
            children: [
                {
                    object: 'block',
                    type: 'code',
                    code: {
                        rich_text: [{ type: 'text', text: { content: data.code } }],
                        language: 'python',
                        caption: [],
                    },
                },
            ],
        });

        console.log('Notion submission successful:', response.id);
        return response;
    } catch (error) {
        console.error('Error adding code to Notion:', error);
        throw error;
    }
}

export async function fetchSubmissions(
    cursor: string | null = null,
    pageSize = 20,
    filterName = '',
) {
    try {
        const databaseId = process.env.NOTION_DATABASE_ID;

        if (!databaseId) {
            throw new Error('NOTION_DATABASE_ID is not configured');
        }

        const query = {
            database_id: databaseId,
            sorts: [{ property: 'Created', direction: 'descending' as const }],
            page_size: pageSize,
            ...(cursor && { start_cursor: cursor }),
            ...(filterName && {
                filter: {
                    property: 'Name',
                    rich_text: { contains: filterName },
                },
            }),
        };

        const response = await notion.databases.query(query);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.results.map((result: any) => ({
            id: result.id,
            Title: result.properties.Title.title[0]?.text?.content || '',
            Number: result.properties.Number?.number,
            Name: result.properties.Name.rich_text[0]?.text?.content || '',
            Index: result.properties.Index?.number,
            Section: result.properties.Section.rich_text[0]?.text?.content || '',
            Book: result.properties.Book.rich_text[0]?.text?.content || '',
            Created: result.properties.Created?.created_time,
        }));

        return { data, next_cursor: response.next_cursor, total: response.results.length };
    } catch (error) {
        console.error('Error fetching submissions from Notion:', error);
        throw error;
    }
}

export async function fetchSubmissionById(id: string) {
    try {
        // ページのプロパティを取得
        const response = await notion.pages.retrieve({ page_id: id });

        // ページのコンテンツ（子ブロック）を取得
        const blocksResponse = await notion.blocks.children.list({ block_id: id });

        // 各ブロックのテキストコンテンツを抽出
        const content = blocksResponse.results
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((block: any) => {
                if (block.type === 'paragraph') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return block.paragraph.rich_text.map((text: any) => text.plain_text).join('');
                } else if (block.type === 'code') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return block.code.rich_text.map((text: any) => text.plain_text).join('');
                }
                // 他のブロックタイプも必要に応じて処理できます
                return '';
            })
            .join('\n');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = response as any;
        const submission = {
            id: responseData.id,
            Title: responseData.properties.Title.title[0]?.text?.content || '',
            Number: responseData.properties.Number?.number,
            Name: responseData.properties.Name.rich_text[0]?.text?.content || '',
            Index: responseData.properties.Index?.number,
            Section: responseData.properties.Section.rich_text[0]?.text?.content || '',
            Book: responseData.properties.Book.rich_text[0]?.text?.content || '',
            Created: responseData.properties.Created?.created_time,
            Content: content, // 提出コンテンツ（コードや文章など）
        };

        return submission;
    } catch (error) {
        console.error('Error fetching submission by ID from Notion:', error);
        throw error;
    }
}
