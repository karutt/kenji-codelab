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
                                content: data.title,
                            },
                        },
                    ],
                },
            },
            children: [
                {
                    object: "block",
                    type: "code",
                    code: {
                        rich_text: [{ type: "text", text: { content: data.code } }],
                        language: "javascript",
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
