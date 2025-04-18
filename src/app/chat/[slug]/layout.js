import Bg from "@/features/chat/components/bg";

export default function ChatLayout({ children }) {
    return (
        <>
            {children}
            <Bg />
        </>
    );
}
