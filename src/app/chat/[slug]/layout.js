import Bg from "@/components/common/bg";
import ChatNav from "@/features/chat/components/ChatNav";
import { Center } from "@chakra-ui/react";

const Layout = ({ children }) => {
    return (
        <>
            <Center h='100vh' w='100vw' position='absolute' zIndex={1}>
                <ChatNav />
                {children}
            </Center>
            <Bg />
        </>
    );
};

export default Layout;
