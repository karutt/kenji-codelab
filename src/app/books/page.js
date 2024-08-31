// public/booksからディレクトリ名一覧を取得
import fs from "fs";
import path from "path";
import Link from "next/link";

export default function Page() {
    const dirPath = path.join(process.cwd(), "public/books");
    const dirs = fs.readdirSync(dirPath);

    return (
        <div>
            {dirs.map((dir) => {
                const path = `/books/${dir}`;
                return (
                    <div key={dir}>
                        <Link href={path}>{dir}</Link>
                    </div>
                );
            })}
        </div>
    );
}
