const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// コマンドライン引数からファイルのパスを取得
const filePath = process.argv[2];

if (!filePath) {
    console.error('Error: No file path provided.');
    process.exit(1);
}

// 更新日を追加または更新する関数
const addOrUpdateDateInFrontMatter = filePath => {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File does not exist at path ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: mdContent } = matter(content);

    // 現在の日付を取得
    const updatedDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd形式

    // フロントマターが存在する場合は更新、存在しない場合は追加
    const newData = { ...data, lastModified: updatedDate };
    const newContent = matter.stringify(mdContent, newData);

    // ファイルに書き戻す
    fs.writeFileSync(filePath, newContent, 'utf8');

    console.log(`Updated date in front matter for ${filePath}`);
};

// 実行
addOrUpdateDateInFrontMatter(filePath);
