'use client';

import { Box, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@/components/common/Icon';

export default function Footer() {
    const pathname = usePathname();

    // Chat ページでは Footer を非表示
    if (pathname && pathname.startsWith('/chat')) {
        return null;
    }

    const links = [
        { name: 'Home', url: '/' },
        { name: 'Lessons', url: '/books' },
    ];

    const contacts = [
        { iconName: 'mail', value: 'karutetto332@gmail.com', isEmail: true },
        { iconName: 'x', value: 'https://x.com/HiragaHiroaki' },
        { iconName: 'line', value: 'https://line.me/ti/p/eaOPsEYsVF' },
    ];

    return (
        <Box
            as="footer"
            zIndex={3}
            px={{ base: 6, lg: 35 }}
            py={10}
            color="white"
            fontWeight="500"
            bg="brand.portgore"
        >
            <Flex
                align="flex-start"
                justify="flex-start"
                direction={{ base: 'column', md: 'row' }}
                gap={{ base: 8, md: 35 }}
            >
                <Box>
                    <Box mb={4} fontSize="xl" fontWeight="700">
                        Navigation
                    </Box>
                    {links.map(link => (
                        <Box key={link.name} mb={4} color="gray.300" fontSize="md">
                            <Link as={NextLink} _hover={{ color: 'white' }} href={link.url}>
                                {link.name}
                            </Link>
                        </Box>
                    ))}
                </Box>

                <Box>
                    <Box mb={4} fontSize="xl" fontWeight="700">
                        Contact
                    </Box>
                    {contacts.map(contact => (
                        <Flex
                            key={contact.iconName}
                            align="center"
                            gap={6}
                            mb={4}
                            color="gray.300"
                            fontSize="xs"
                            fontWeight="400"
                        >
                            <Icon name={contact.iconName} width="24px" height="24px" />
                            {contact.isEmail ? (
                                <Link _hover={{ color: 'white' }} href={`mailto:${contact.value}`}>
                                    {contact.value}
                                </Link>
                            ) : (
                                <Link
                                    _hover={{ color: 'white' }}
                                    href={contact.value}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    {contact.value}
                                </Link>
                            )}
                        </Flex>
                    ))}
                </Box>
            </Flex>

            <Box
                mt={6}
                pt={6}
                color="gray.300"
                fontSize="xs"
                textAlign="center"
                borderColor="gray.600"
                borderTop="1px"
            >
                Copyright © 2024 KeNJi CodeLab.com
            </Box>
        </Box>
    );
}
