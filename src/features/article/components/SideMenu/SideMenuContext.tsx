'use client';

import React, { createContext, useContext, useState } from 'react';

interface SideMenuContextType {
    showSideMenu: boolean;
    setShowSideMenu: (show: boolean) => void;
}

const SideMenuContext = createContext<SideMenuContextType | undefined>(undefined);

export const SideMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showSideMenu, setShowSideMenu] = useState(true);

    return (
        <SideMenuContext.Provider value={{ showSideMenu, setShowSideMenu }}>
            {children}
        </SideMenuContext.Provider>
    );
};

export const useSideMenu = (): SideMenuContextType => {
    const context = useContext(SideMenuContext);
    if (context === undefined) {
        throw new Error('useSideMenu must be used within a SideMenuProvider');
    }
    return context;
};
