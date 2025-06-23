import { Box, Flex } from '@chakra-ui/react';

import { Card } from '@/components/common/Card';

import CardBody from './CardBody';
import CardHead from './CardHead';

interface SectionListProps {
    bookList: string[][];
    bookName: string;
}

export default function SectionList({ bookList, bookName }: SectionListProps) {
    return (
        <Box pos="relative" zIndex={2} pb={30}>
            <Flex align="center" justify="center" direction="column" gap={6}>
                {bookList.map((list, section) => (
                    <Card key={section} pb={10} py={10} px={8} pt={8} maxW="700px" w="100%">
                        <CardHead index={section} bookName={bookName} title={list[0]} />
                        <CardBody list={list.slice(1)} bookName={bookName} section={section} />
                    </Card>
                ))}
            </Flex>
        </Box>
    );
}
