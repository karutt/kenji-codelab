"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import SubmitTable from "./SubmitTable";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SubmitContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // クエリパラメータから初期値を取得
    const [currentCursor, setCurrentCursor] = useState(searchParams.get("cursor") || "initial");
    const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 100);
    const [filterName, setFilterName] = useState(searchParams.get("filter") || "");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page") || 1));

    // クエリパラメータから`previousCursors`を取得（カンマ区切りでエンコードされている場合）
    const initialPreviousCursors = searchParams.get("previousCursors")
        ? searchParams.get("previousCursors").split(",")
        : [];
    const [previousCursors, setPreviousCursors] = useState(initialPreviousCursors);

    // データの取得
    const { data, error } = useSWR(
        `/api/submit?cursor=${currentCursor}&pageSize=${pageSize}&filter=${filterName}`,
        fetcher,
        { revalidateOnFocus: false }
    );

    // クエリパラメータの変更を監視して状態を更新
    useEffect(() => {
        const newCursor = searchParams.get("cursor") || "initial";
        const newPageSize = Number(searchParams.get("pageSize")) || 100;
        const newFilterName = searchParams.get("filter") || "";
        const newPage = Number(searchParams.get("page") || 1);
        const newPreviousCursors = searchParams.get("previousCursors")
            ? searchParams.get("previousCursors").split(",")
            : [];

        // クエリパラメータが変更された場合のみ状態を更新
        if (newCursor !== currentCursor) setCurrentCursor(newCursor);
        if (newPageSize !== pageSize) setPageSize(newPageSize);
        if (newFilterName !== filterName) setFilterName(newFilterName);
        if (newPage !== currentPage) setCurrentPage(newPage);
        if (JSON.stringify(newPreviousCursors) !== JSON.stringify(previousCursors))
            setPreviousCursors(newPreviousCursors);
    }, [searchParams]); // searchParamsの変化を監視

    // クエリパラメータをURLに反映させ、履歴に追加
    useEffect(() => {
        const params = new URLSearchParams();
        if (currentCursor) params.set("cursor", currentCursor);
        if (pageSize) params.set("pageSize", pageSize.toString());
        if (filterName) params.set("filter", filterName);
        if (currentPage) params.set("page", currentPage.toString());
        if (previousCursors.length > 0) params.set("previousCursors", previousCursors.join(",")); // カンマ区切りで保存
        router.push(`?${params.toString()}`);
    }, [currentCursor, pageSize, filterName, currentPage, previousCursors, router]);

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentCursor("initial");
        setCurrentPage(1);
        setPreviousCursors([]);
    };

    const handleNextPage = () => {
        if (data?.next_cursor) {
            const updatedPreviousCursors = [...previousCursors, currentCursor];
            setPreviousCursors(updatedPreviousCursors); // 状態を更新
            setCurrentCursor(data.next_cursor);
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (previousCursors.length > 0) {
            const newPreviousCursors = [...previousCursors];
            const lastCursor = newPreviousCursors.pop();
            setPreviousCursors(newPreviousCursors); // 状態を更新
            setCurrentCursor(lastCursor);
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearch = () => {
        setFilterName(searchTerm);
        setCurrentCursor("initial");
        setCurrentPage(1);
        setPreviousCursors([]);
    };

    if (error) {
        return (
            <p style={{ marginTop: "64px" }}>
                データの取得中にエラーが発生しました: {error.message}
            </p>
        );
    }

    return (
        <SubmitTable
            data={data}
            handlePageSizeChange={handlePageSizeChange}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            handleSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            pageSize={pageSize}
            previousCursors={previousCursors}
            currentPage={currentPage}
        />
    );
}
