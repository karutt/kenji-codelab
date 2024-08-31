import { Box } from "@/styles";
import Link from "next/link";

export default function CardBody({ list, bookName, section }) {
    return (
        <Box
            borderLeft='1px dashed #495057'
            ml={24}
            pt={20}
            gap={16}
            fontSize={16}
            fontWeight={500}
            display='flex'
            flexDirection='column'>
            {list.map((title, subSection) => (
                <Box key={subSection} pl={24} position='relative'>
                    <Box
                        position='absolute'
                        borderRadius={100}
                        top='6px'
                        left={-9}
                        width={16}
                        height={16}
                        bg='white'
                        border='1px dashed #495057'></Box>
                    <Link
                        href={`/books/${bookName}/${
                            String(section + 1) + "-" + String(subSection + 1)
                        }`}>
                        {title}
                    </Link>
                </Box>
            ))}
        </Box>
    );
}
