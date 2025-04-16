import matter from "gray-matter";
import path from "path";
import fs from "fs";

export function getFileTitlesFromFrontMatter(files, dirPath) {
    return files.map((fileName) => {
        const filePath = path.join(dirPath, fileName);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        return {
            fileName,
            title: data.title,
        };
    });
}

export function sortAndGroupArticles(articles) {
    return articles
        .sort((a, b) => {
            const [sectionA, subSectionA] = a.fileName.split("-").map((num) => parseInt(num, 10));
            const [sectionB, subSectionB] = b.fileName.split("-").map((num) => parseInt(num, 10));

            if (sectionA !== sectionB) {
                return sectionA - sectionB;
            }

            return subSectionA - subSectionB;
        })
        .reduce((acc, lesson) => {
            const [section] = lesson.fileName.split("-");
            const sectionNumber = parseInt(section, 10);

            if (!acc[sectionNumber - 1]) {
                acc[sectionNumber - 1] = [];
            }

            acc[sectionNumber - 1].push(lesson);

            return acc;
        }, []);
}
