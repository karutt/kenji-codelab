import { Provider } from "@/components/ui/provider";
import Bg from "@/features/chat/components/bg";

export default function ChatLayout({ children }) {
    return (
        <section>
            <Provider>
                {children}
                <Bg />
            </Provider>
        </section>
    );
}
