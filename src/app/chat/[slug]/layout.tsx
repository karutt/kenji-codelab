import { Center } from '@chakra-ui/react';
import { ReactNode } from 'react';

import Bg from '@/components/common/Bg';
import ChatNav from '@/features/chat/components/ChatNav';

interface ChatLayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: ChatLayoutProps) => {
    return (
        <>
            <Center pos="absolute" zIndex={1} w="100vw" h="100vh">
                <ChatNav />
                {children}
            </Center>
            <Bg />
        </>
    );
};

export default Layout;
