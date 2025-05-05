// public/booksからディレクトリ名一覧を取得

import Lessons from "@/components/Lessons/Lessons";
import fs from "fs";
import path from "path";

export default function Page() {
    const dirPath = path.join(process.cwd(), "public/books");

    const dirs = fs.readdirSync(dirPath).filter((dir) => {
        const fullPath = path.join(dirPath, dir);
        return fs.statSync(fullPath).isDirectory();
    });
    // ただし、英語版の記事はフォルダ名が「_en」で終わるので、除外する
    const configs = dirs
        .map((dir) => {
            const configPath = path.join(dirPath, dir, "config.json");
            let result = JSON.parse(fs.readFileSync(configPath, "utf-8"));
            result.slug = dir;

            return result;
        })
        .filter((config) => !config.slug.endsWith("_en"));

    // configsの要素の辞書型にある"n"がキーの数字順でソートする
    configs.sort((a, b) => {
        const aNum = Number(a.n);
        const bNum = Number(b.n);
        return aNum - bNum;
    });

    return (
        <div className='books'>
            <Lessons configs={configs} />
        </div>
    );
}
