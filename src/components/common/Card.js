import { Box } from "@/styles";
import { space } from "styled-system";

import styled from "styled-components";

const Card = styled(Box)`
    padding: 32px;
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.black12};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    max-width: 700px;
    width: 100%;
    z-index: 1;
    ${space}
`;

const SideMenuCard = styled(Card)`
    position: sticky;
    padding: 0;
    top: 64px;
    height: calc(100vh - 64px);
    overflow: auto;
    padding-bottom: 120px;

    /* WebKitベースのブラウザ（Chrome、Safari、新しいEdgeなど）用 */
    &::-webkit-scrollbar {
        display: none;
    }

    /* IE、Edgeの古いバージョン用 */
    -ms-overflow-style: none;

    /* Firefox用 */
    scrollbar-width: none;
`;

const SideMenuHeadCard = styled(Card)`
    padding: 0;
    margin-bottom: 8px;
`;

const ArticleCard = styled(Card)`
    max-width: 860px;
    padding: 0px 0px;
    padding-bottom: 32px;
`;

export { ArticleCard, Card, SideMenuCard, SideMenuHeadCard };
