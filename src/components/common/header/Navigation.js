"use client";
import { Box } from "@/styles";
import Link from "next/link";
import HeaderBox from "./HeaderBox";

export default function Navigation({ pathname, user, loading }) {
    const links = [
        { name: "Home", url: "/" },
        { name: "Lessons", url: "/books/" },
    ];
    // ログイン済みならChatを追加
    if (!loading && user) {
        links.push({ name: "Chat", url: "/chat/home" });
    }

    return (
        <Box display='flex' alignItems='center' justifyContent='center' gap={24}>
            {links.map((link) => (
                <HeaderBox key={link.name} isActive={pathname === link.url}>
                    <Link href={link.url}>{link.name}</Link>
                </HeaderBox>
            ))}
            <Box color='white' opacity={0.6}>
                {pathname.includes("/books/") &&
                    (pathname.endsWith("_en") ? (
                        <Link href={pathname.replace("_en", "")}>Ja</Link>
                    ) : (
                        (() => {
                            const splitted = pathname.split("/");
                            if (splitted[1] === "books" && splitted[2]) {
                                // すでに_enがついていれば外す
                                if (splitted[2].endsWith("_en")) {
                                    splitted[2] = splitted[2].replace(/_en$/, "");
                                } else {
                                    splitted[2] += "_en";
                                }
                            }
                            return <Link href={splitted.join("/")}>En</Link>;
                        })()
                    ))}
            </Box>
        </Box>
    );
}
