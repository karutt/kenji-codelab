"use client";
import { Box, Icon } from "@/styles";

import { SideMenuCard, SideMenuHeadCard } from "@/components/common/Card";
import SideMenuHead from "./SideMenuHead";
import SideMenuBody from "./SideMenuBody";

export default function SideMenu({ config, bookName, articleSlug }) {
    return (
        <Box
            width={432}
            minWidth={432}
            p={32}
            px={16}
            zIndex={2}
            bg='zennBlue'
            position='relative'
            display={["none", "none", "block"]}>
            <SideMenuHeadCard>
                <SideMenuHead config={config} bookName={bookName} />
            </SideMenuHeadCard>
            <SideMenuCard>
                <SideMenuBody config={config} bookName={bookName} articleSlug={articleSlug} />
            </SideMenuCard>
        </Box>
    );
}
