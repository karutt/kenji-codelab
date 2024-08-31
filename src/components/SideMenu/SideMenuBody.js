import { Box } from "@/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideMenuBody({ config, bookName, articleSlug }) {
    const pathname = usePathname();
    const [_section, _subSection] = articleSlug.split("-").map((num) => Number(num));

    return (
        <Box pt={32} color='abbey' px={32}>
            {config.bookList.map((list, index) => {
                const _isActive = _section === index + 1 && _subSection === 0;
                return (
                    <Box mb={12} key={index}>
                        <Box>
                            <Box fontSize={14} mb={
                                2}>
                                Chapter {index + 1}
                            </Box>

                            <Link
                                href={`/books/${bookName}/${String(index + 1) + "-" + String(0)}`}>
                                <Box
                                    fontSize={18}
                                    fontWeight={_isActive ? "700" : "500"}
                                    bg={_isActive ? "lilac" : "white"}>
                                    {list[0]}
                                </Box>
                            </Link>
                        </Box>
                        <Box
                            display='flex'
                            flexDirection='column'
                            gap={4}
                            ml={24}
                            fontSize={14}
                            pl={12}
                            py={12}
                            borderLeft='4px solid #DEE2E6'>
                            {list.slice(1).map((title, subSection) => {
                                const isActive =
                                    _section === index + 1 && subSection + 1 === _subSection;
                                return (
                                    <Box
                                        key={subSection}
                                        position='relative'
                                        bg={isActive ? "lilac" : "white"}
                                        fontWeight={isActive ? "700" : "400"}
                                        py={4}
                                        pl={4}>
                                        <Link
                                            href={`/books/${bookName}/${
                                                String(index + 1) + "-" + String(subSection + 1)
                                            }`}>
                                            {title}
                                        </Link>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
