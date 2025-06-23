// notion/notion.js
import { Client } from '@notionhq/client';

// Notionクライアントの初期化
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default notion;
