"use client";
import { Box, Icon } from "@/styles";
import { useSideMenu } from "@/components/SideMenu/SideMenuContext";

import { SideMenuCard, SideMenuHeadCard } from "@/components/common/Card";
import SideMenuHead from "./SideMenuHead";
import SideMenuBody from "./SideMenuBody";

export default function SideMenu({ config, bookName, articleSlug }) {
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
                <SideMenuHead config={config} bookName={bookName} />
            </SideMenuHeadCard>
            <SideMenuCard>
                <SideMenuBody config={config} bookName={bookName} articleSlug={articleSlug} />
            </SideMenuCard>
        </Box>
    );
}
