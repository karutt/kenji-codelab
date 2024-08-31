// /Users/mir/nextjs/kenji-codelab/public/books/generateBookList.js
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Booksディレクトリのパス
const booksDirectoryPath = path.join(__dirname);

// Booksディレクトリ内のサブディレクトリを走査
const bookDirs = fs
    .readdirSync(booksDirectoryPath)
    .filter((dir) => fs.statSync(path.join(booksDirectoryPath, dir)).isDirectory());

bookDirs.forEach((bookDir) => {
    const mdDirPath = path.join(booksDirectoryPath, bookDir, "md");
    const configFilePath = path.join(booksDirectoryPath, bookDir, "config.json");

    if (fs.existsSync(mdDirPath) && fs.existsSync(configFilePath)) {
        const files = fs.readdirSync(mdDirPath).filter((file) => file.endsWith(".md"));

        // セクションでグループ化してソート
        const groupedBookList = files.reduce((acc, file) => {
            const filePath = path.join(mdDirPath, file);
            const content = fs.readFileSync(filePath, "utf8");
            const { data } = matter(content);

            // ファイル名をセクションとサブセクションに分ける
            const [section] = file.replace(".md", "").split("-");

            const title = data.title || "No Title";

            // セクションが既に存在するか確認
            if (!acc[section]) {
                acc[section] = [];
            }

            acc[section].push(title);

            // サブセクションでソート
            acc[section].sort((a, b) => {
                const aIndex = files.findIndex((f) => f.includes(a));
                const bIndex = files.findIndex((f) => f.includes(b));
                return aIndex - bIndex;
            });

            return acc;
        }, {});

        // セクションごとに2次元配列に変換
        const sortedBookList = Object.keys(groupedBookList)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
            .map((section) => groupedBookList[section]);

        // config.jsonを読み込み、bookListキーとarticleCountキーを更新
        let config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
        config.bookList = sortedBookList;
        config.articleCount = files.length; // 記事数を追加または更新

        // 更新された内容をconfig.jsonに書き戻す
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

        console.log(`Updated bookList and articleCount in ${configFilePath} for ${bookDir}.`);
    } else {
        console.warn(`Skipping ${bookDir} as it lacks md directory or config.json.`);
    }
});
