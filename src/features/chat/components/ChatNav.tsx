'use client';
import { Avatar, Box, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'next/navigation';

const chatLinks = [
    {
        href: '/chat/global',
        label: 'Global Chat',
        avatar: {
            name: 'Global Chat',
            src: '/svg/global_chat.svg',
        },
    },
    {
        href: '/chat/programming',
        label: 'Programming Chat',
        avatar: {
            name: 'Programming Chat',
            src: '/svg/prog_chat.svg',
        },
    },
];

const ChatNav = () => {
    const { slug } = useParams();
    return (
        <Box
            className="chat-nav"
            zIndex={3}
            alignItems="stretch"
            w={280}
            h="80vh"
            maxH={640}
            py={4}
            bg="white"
            borderLeftRadius={8}
        >
            <VStack
                align="stretch"
                gap={0}
                h="100%"
                borderRight="solid 1px"
                borderRightColor="brand.e2"
            >
                {chatLinks.map(({ href, label, avatar }, index) => {
                    const isActive = slug === href.split('/').pop();

                    return (
                        <Link
                            key={href}
                            as={Link}
                            px={4}
                            py={2}
                            bg={isActive ? 'gray.100' : 'white'}
                            borderBottom={index !== chatLinks.length - 1 ? '1px solid' : 'none'}
                            borderBottomColor="brand.e2"
                            _hover={{ bg: 'gray.100' }}
                            href={href}
                        >
                            <HStack p={2} borderRadius="md">
                                <Avatar.Root>
                                    <Avatar.Fallback name={avatar.name} />
                                    <Avatar.Image src={avatar.src} />
                                </Avatar.Root>
                                <Text color="brand.shark" fontWeight="500">
                                    {label}
                                </Text>
                            </HStack>
                        </Link>
                    );
                })}
            </VStack>
        </Box>
    );
};

export default ChatNav;
