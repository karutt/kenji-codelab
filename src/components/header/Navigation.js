"use client";
import { Box } from "@/styles";
import HeaderBox from "./HeaderBox";
import Link from "next/link";

export default function Navigation({ pathname }) {
    const links = [
        { name: "Home", url: "/" },
        { name: "Lessons", url: "/books/p5_tutorial" },
        { name: "Submit", url: "/submit" },
    ];

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
                        <Link href={`${pathname}_en`}>En</Link>
                    ))}
            </Box>
        </Box>
    );
}
