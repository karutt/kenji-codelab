"use client";
import { Box, Icon } from "@/styles";
import Link from "next/link";
export default function Footer() {
    const links = [
        { name: "Home", url: "/" },
        { name: "Lessons", url: "/books/p5_tutorial" },
        { name: "Submit", url: "/submit" },
    ];
    const contacts = [
        { iconName: "mail", value: "karutetto332@gmail.com", mail: 1 },
        { iconName: "x", value: "https://x.com/HiragaHiroaki" },
        { iconName: "line", value: "https://line.me/ti/p/eaOPsEYsVF" },
    ];
    return (
        <Box bg='portgore' color='white' fontWeight='500' gap={24} py={40} px={140} zIndex={3}>
            <Box display='flex' alignItems='center' justifyContent='flex-start' gap={140}>
                <Box>
                    <Box fontSize={20} mb={16} fontWeight={700}>
                        Navigation
                    </Box>
                    {links.map((link) => (
                        <Box key={link} fontSize={16} color='white5' mb={16}>
                            <Link key={link.name} href={link.url}>
                                {link.name}
                            </Link>
                        </Box>
                    ))}
                </Box>
                <Box>
                    <Box fontSize={20} mb={16} fontWeight={700}>
                        Contact
                    </Box>
                    {contacts.map((contact) => (
                        <Box
                            key={contact.iconName}
                            fontSize={12}
                            color='white5'
                            mb={16}
                            display='flex'
                            gap={24}
                            fontWeight={400}>
                            <Icon name={contact.iconName} width={24} height='100%' />
                            {/* メールかどうか判定 */}
                            {contact.mail ? (
                                <Link href={`mailto:${contact.value}`}>{contact.value}</Link>
                            ) : (
                                <Link href={contact.value}>{contact.value}</Link>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box color='white5' fontSize={12} textAlign='center' mt={24}>
                Copyright © 2024 KeNJi CodeLab.com
            </Box>
        </Box>
    );
}
