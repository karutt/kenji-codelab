import fs from "fs";
import path from "path";
import React from "react";

export default function Layout({ children }) {
    return <>{children}</>;
}

export async function generateStaticParams() {
    const dirPath = path.join(process.cwd(), "public/books");
    const dirs = fs.readdirSync(dirPath).filter((file) => {
        return fs.statSync(path.join(dirPath, file)).isDirectory();
    });
    return dirs.map((dir) => ({
        bookSlug: dir,
    }));
}
