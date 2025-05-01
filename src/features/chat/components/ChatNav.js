import { Avatar, Box, Link as ChakraLink, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

const chatLinks = [
    {
        href: "/chat/global",
        label: "Global Chat",
        avatar: {
            name: "Segun Adebayo",
            src: "/svg/global_chat.svg",
        },
    },
    {
        href: "/chat/room",
        label: "Programming Chat",
        avatar: {
            name: "Segun Adebayo",
            src: "/svg/prog_chat.svg",
        },
    },
];

const ChatNav = () => (
    <Box
        w={280}
        bg='white'
        alignItems='stretch'
        h='80vh'
        maxH={640}
        zIndex={3}
        className='chat-nav'
        py={4}
        borderLeftRadius={8}>
        <VStack align='stretch' gap={0}>
            {chatLinks.map(({ href, label, avatar }, index) => (
                <ChakraLink
                    as={Link}
                    href={href}
                    _hover={{ bg: "gray.100" }}
                    px={4}
                    py={2}
                    borderBottom={index !== chatLinks.length - 1 ? "1px solid #E2E8F0" : "none"}
                    key={href}>
                    <HStack p={2} borderRadius='md'>
                        <Avatar.Root>
                            <Avatar.Fallback name={avatar.name} />
                            <Avatar.Image src={avatar.src} />
                        </Avatar.Root>
                        <Text fontWeight='500' color='brand.shark'>
                            {label}
                        </Text>
                    </HStack>
                </ChakraLink>
            ))}
        </VStack>
    </Box>
);

export default ChatNav;
