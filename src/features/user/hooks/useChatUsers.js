"use client";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useChatUsers(uids) {
    console.log({ uids });
    const [users, setUsers] = useState({});

    useEffect(() => {
        if (uids.length === 0) return;

        // Firestore の "in" クエリは最大10個の uid までなので、必要に応じて分割処理が必要です。
        const q = query(collection(db, "users"), where("uid", "in", uids));
        getDocs(q).then((snapshot) => {
            const userMap = {};
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                userMap[data.uid] = data;
            });
            setUsers(userMap);
        });
    }, [uids]);

    return users;
}
