// context/SideMenuContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

// Contextの作成
const SideMenuContext = createContext();

export const SideMenuProvider = ({ children }) => {
    const [showSideMenu, setShowSideMenu] = useState(true); // 初期状態は表示

    return (
        <SideMenuContext.Provider value={{ showSideMenu, setShowSideMenu }}>
            {children}
        </SideMenuContext.Provider>
    );
};

// カスタムフックを作成して他のコンポーネントで使えるようにする
export const useSideMenu = () => useContext(SideMenuContext);
