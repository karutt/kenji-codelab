"use client";
import Link from "next/link";
import { Box } from "@/styles";
import { Card } from "@/components/common/Card";
import CardHead from "./CardHead";
import CardBody from "./CardBody";

export default function SectionList({ bookList, bookName }) {
    return (
        <Box bg='lilac' pb={120}>
            <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                flexDirection='column'
                gap={24}>
                {bookList.map((list, section) => (
                    <Card key={section} pb={40}>
                        <CardHead index={section} bookName={bookName} title={list[0]} />
                        <CardBody list={list.slice(1)} bookName={bookName} section={section} />
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
