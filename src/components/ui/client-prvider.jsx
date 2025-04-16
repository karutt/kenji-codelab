"use client";
import { Provider } from "@/components/ui/provider";
import { system } from "@/utils/chakura_theme";
const ClientPrvider = ({ children }) => {
    return <Provider value={system}>{children}</Provider>;
};

export default ClientPrvider;
