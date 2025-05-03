// src/components/SideMenu/SideMenu.js
"use client";

import { SideMenuCard, SideMenuHeadCard } from "@/components/common/Card";
import { Box } from "@/styles";
import SideMenuBody from "./SideMenuBody";
import { useSideMenu } from "./SideMenuContext";
import SideMenuHead from "./SideMenuHead";
export default function SideMenu({ bookName, articleSlug }) {
    const { showSideMenu } = useSideMenu();

    return (
        <Box
            width={432}
            minWidth={432}
            p={32}
            px={16}
            zIndex={2}
            bg='zennBlue'
            position='relative'
            className='side-menu'
            display={["none", "none", showSideMenu ? "block" : "none"]}>
            <SideMenuHeadCard>
                <SideMenuHead bookName={bookName} />
            </SideMenuHeadCard>
            <SideMenuCard>
                <SideMenuBody bookName={bookName} articleSlug={articleSlug} />
            </SideMenuCard>
        </Box>
    );
}
