import { Box, Icon } from "@/styles";
import Link from "next/link";

export default function SideMenuHead({ config, bookName }) {
    return (
        <Box
            borderBottom='1px solid rgba(0, 0, 0, 0.1)'
            pb={24}
            py={32}
            bg='lilac'
            px={32}
            borderRadius={10}>
            <Link href={`/books/${bookName}`}>
                <Box display='flex' alignItems='center' justifyContent='flex-start' gap={12}>
                    <Icon name={`${bookName}_icon`} width={48} height='100%' />
                    <Box>
                        <Box fontSize={18} fontWeight='500' color='shark'>
                            {config.subTitle}
                        </Box>
                        <Box fontSize={12} color='hitGray'>
                            {config.category}
                        </Box>
                    </Box>
                </Box>
            </Link>
        </Box>
    );
}
