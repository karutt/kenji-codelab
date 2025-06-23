import { Box } from '@chakra-ui/react';
import fs from 'fs';
import path from 'path';

import LessonsComponent from '@/components/Lessons/Lessons';

// 元のプロジェクトのconfig.json形式に合わせた型定義
interface BookConfig {
    slug: string;
    subTitle: string;
    description: string;
    articleCount: number;
    estimatedTime: string;
    n: number;
}

export default function BooksPage() {
    // 元のプロジェクトの実装を再現
    const dirPath = path.join(process.cwd(), 'public/books');

    const dirs = fs.readdirSync(dirPath).filter(dir => {
        const fullPath = path.join(dirPath, dir);
        return fs.statSync(fullPath).isDirectory();
    });

    // 英語版の記事はフォルダ名が「_en」で終わるので、除外する
    const configs: BookConfig[] = dirs
        .map(dir => {
            const configPath = path.join(dirPath, dir, 'config.json');
            const result = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            result.slug = dir;
            return result;
        })
        .filter(config => !config.slug.endsWith('_en'));

    // configsの要素の辞書型にある"n"がキーの数字順でソートする
    configs.sort((a, b) => {
        const aNum = Number(a.n);
        const bNum = Number(b.n);
        return aNum - bNum;
    });

    return (
        <Box className="books">
            <LessonsComponent configs={configs} />
        </Box>
    );
}
