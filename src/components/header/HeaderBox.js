"use client";
import styled from "styled-components";
import { Box } from "@/styles";

const HeaderBox = styled(Box)`
    font-size: 16px;
    font-weight: 500;
    line-height: 100%;
    color: white;
    cursor: pointer;
    opacity: ${({ isActive }) => (isActive ? "100%" : "60%")};
    transition: opacity 0.3s;

    &:hover {
        opacity: 85%;
        transition: opacity 0.3s;
    }

    &:active {
        opacity: 100%;
        transition: opacity 0.3s;
    }
`;

export default HeaderBox;
