import { Box, Icon } from "@/styles";
import Link from "next/link";

export default function CardHead({ index, bookName, title }) {
    const bookNameWithoutLang = bookName.endsWith("_en") ? bookName.slice(0, -3) : bookName;
    return (
        <Link href={`/books/${bookName}/${index + 1}-0`}>
            <Box display='flex' alignItems='center' justifyContent='flex-start' gap={24}>
                <Icon name={`${bookNameWithoutLang}_icon${index + 1}`} width={46} height='100%' />
                <Box>
                    <Box color='abbey' fontSize={14}>
                        Chapter{index + 1}
                    </Box>
                    <Box color='shark' fontSize={18} fontWeight={700}>
                        {title}
                    </Box>
                </Box>
            </Box>
        </Link>
    );
}
