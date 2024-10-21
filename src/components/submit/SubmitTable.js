import Link from "next/link";
import { Search } from "@/components/common/Form";
import { WBtn } from "@/components/common/Btn";
import { Box, Icon } from "@/styles";
import styled from "styled-components";

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    th {
        border-top: 1px solid #dee2e6;
        border-bottom: 1px solid #dee2e6;

        text-align: left;
        padding: 12px 16px;
        font-weight: 500;
    }
    td {
        font-weight: 400;
        border-bottom: 1px solid #dee2e6;
        padding: 12px 16px;
        color: ${(props) => props.theme.colors.shark};
    }

    // 2行目以降の奇数行の背景色を変更
    tr:nth-child(2n) {
        background-color: ${(props) => props.theme.colors.lilac};
    }
`;

export default function SubmitTable({
    data,
    handlePreviousPage,
    handleNextPage,
    previousCursors,
    searchTerm,
    setSearchTerm,
    handleSearch,
    currentPage,
}) {
    return (
        <Box
            mt={64}
            pb={120}
            bg='white'
            display='flex'
            alignItems='center'
            justifyContent='center'
            flexDirection='column'
            width='100vw'>
            <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                flexDirection='column'
                py={80}
                bg='lilac'
                width='100%'
                position='relative'
                overflow='hidden'>
                <Box fontSize={40} fontWeight='bold' mb={6}>
                    Code Preview List
                </Box>
                <Box mb={40} fontSize={16}>
                    レッスンで提出した課題が一覧できます。提出した課題の状況を確認しましょう。
                </Box>
                <Box as='span' position='absolute' bottom='-5px' height='auto'>
                    <Icon name='white_shape' width='100vw' height='100px' />
                </Box>
            </Box>
            <Box maxWidth={1000} width='100%' mt={32}>
                <Box display='flex' alignItems='center' justifyContent='center' mb={64}>
                    <Search
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={handleSearch}
                    />
                </Box>

                <Box display='flex' alignItems='center' justifyContent='center' gap={24} my={16}>
                    <WBtn
                        as='button'
                        onClick={handlePreviousPage}
                        disabled={previousCursors.length === 0}>
                        前のページ
                    </WBtn>
                    <Box>{currentPage}</Box> {/* 現在のページ番号を表示 */}
                    <WBtn as='button' onClick={handleNextPage} disabled={!data?.next_cursor}>
                        次のページ
                    </WBtn>
                </Box>

                {data ? (
                    <>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Scores</th>
                                    <th>Name</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((submission) => (
                                    <tr key={submission.id}>
                                        <td>
                                            <Link
                                                href={`/submit/content/${submission.id}`}
                                                scroll={false}>
                                                {submission.Title}
                                            </Link>
                                        </td>
                                        <td>{submission.Number}</td>
                                        <td>{submission.Name}</td>
                                        <td>{formatDateTime(submission.Created)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <Box width='100%' display='flex' alignItems='center' justifyContent='center'>
                        loading...
                    </Box>
                )}
            </Box>
        </Box>
    );
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString().slice(0, -3);
}
