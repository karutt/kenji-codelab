import { useEffect, useState } from "react";

/**
 * モーダル表示・ローカルストレージ連携用フック
 */
export function useKenjiName(router, setShowProblem, setShowCard, setShowSideMenu) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("kenji_name");
        if (saved) setName(saved);
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const saveNameToLocalStorage = () => {
        if (name.trim()) {
            localStorage.setItem("kenji_name", name.trim());
            setIsModalOpen(false);
            setShowProblem(true);
            setShowCard(false);
            router.push("?view=problem", { scroll: false });
            setShowSideMenu(false);
        } else {
            alert("名前を入力してください！");
        }
    };

    return { name, setName, isModalOpen, openModal, closeModal, saveNameToLocalStorage };
}
