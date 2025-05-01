"use client";
import { Avatar, Box, Link as ChakraLink, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
const chatLinks = [
    {
        href: "/chat/global",
        label: "Global Chat",
        avatar: {
            name: "Global Chat",
            src: "/svg/global_chat.svg",
        },
    },
    {
        href: "/chat/programming",
        label: "Programming Chat",
        avatar: {
            name: "Programming Chat",
            src: "/svg/prog_chat.svg",
        },
    },
];

const ChatNav = () => {
    const { slug } = useParams();
    return (
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
            <VStack align='stretch' gap={0} borderRight='solid 1px' borderColor='brand.e2' h='100%'>
                {chatLinks.map(({ href, label, avatar }, index) => {
                    const isActive = slug === href.split("/").pop();

                    return (
                        <ChakraLink
                            as={Link}
                            href={href}
                            _hover={{ bg: "gray.100" }}
                            bg={isActive ? "gray.100" : "white"}
                            px={4}
                            py={2}
                            borderBottom={index !== chatLinks.length - 1 ? "1px solid" : "none"}
                            borderColor='brand.e2'
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
                    );
                })}
            </VStack>
        </Box>
    );
};

export default ChatNav;
