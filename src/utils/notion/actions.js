// notion/actions.js
"use server";

import notion from "./notion"; // Notionクライアントをインポート

export async function addCodeToNotion(data) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: process.env.NOTION_DATABASE_ID },
            properties: {
                Title: {
                    title: [
                        {
                            text: {
                                content: data.articleSlug + "-" + data.index,
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
                    object: "block",
                    type: "code",
                    code: {
                        rich_text: [{ type: "text", text: { content: data.code } }],
                        language: data.language,
                        caption: [],
                    },
                },
            ],
        });
        return response;
    } catch (error) {
        console.error("Error adding code to Notion:", error);
        throw error;
    }
}

export async function fetchSubmissions(cursor = null, pageSize = 20, filterName = "") {
    try {
        const query = {
            database_id: process.env.NOTION_DATABASE_ID,
            sorts: [{ property: "Created", direction: "descending" }],
            page_size: pageSize,
        };

        if (cursor) {
            query.start_cursor = cursor;
        }

        if (filterName) {
            query.filter = {
                property: "Name",
                rich_text: { contains: filterName },
            };
        }

        const response = await notion.databases.query(query);

        const data = response.results.map((result) => ({
            id: result.id,
            Title: result.properties.Title.title[0]?.text?.content || "",
            Number: result.properties.Number.number,
            Name: result.properties.Name.rich_text[0]?.text?.content || "",
            Index: result.properties.Index.number,
            Section: result.properties.Section.rich_text[0]?.text?.content || "",
            Book: result.properties.Book.rich_text[0]?.text?.content || "",
            Created: result.properties.Created.created_time,
        }));

        return { data, next_cursor: response.next_cursor, total: response.total };
    } catch (error) {
        console.error("Error fetching submissions from Notion:", error);
        throw error;
    }
}

export async function fetchSubmissionById(id) {
    try {
        // ページのプロパティを取得
        const response = await notion.pages.retrieve({ page_id: id });

        // ページのコンテンツ（子ブロック）を取得
        const blocksResponse = await notion.blocks.children.list({ block_id: id });

        // 各ブロックのテキストコンテンツを抽出
        const content = blocksResponse.results
            .map((block) => {
                if (block.type === "paragraph") {
                    return block.paragraph.rich_text.map((text) => text.plain_text).join("");
                } else if (block.type === "code") {
                    return block.code.rich_text.map((text) => text.plain_text).join("");
                }
                // 他のブロックタイプも必要に応じて処理できます
                return "";
            })
            .join("\n");

        const submission = {
            id: response.id,
            Title: response.properties.Title.title[0]?.text?.content || "",
            Number: response.properties.Number.number,
            Name: response.properties.Name.rich_text[0]?.text?.content || "",
            Index: response.properties.Index.number,
            Section: response.properties.Section.rich_text[0]?.text?.content || "",
            Book: response.properties.Book.rich_text[0]?.text?.content || "",
            Created: response.properties.Created.created_time,
            Content: content, // 提出コンテンツ（コードや文章など）
        };

        return submission;
    } catch (error) {
        console.error("Error fetching submission by ID from Notion:", error);
        throw error;
    }
}
