import { Box, Icon } from "@/styles";

import styled from "styled-components";

const InputField = styled(Box)`
    border: none;
    font-weight: 300;
    color: ${(props) => props.theme.colors.abbey};

    &:focus {
        outline: none;
    }
`;

export function Search({ onChange, value, onClick }) {
    return (
        <Box
            display='flex'
            alignItems='center'
            justifyContent='flex-start'
            border='1.5px solid #DEE2E6'
            borderRadius={4}
            width={500}>
            <Box
                onClick={onClick}
                width={60}
                display='flex'
                alignItems='center'
                justifyContent='center'
                height={50}
                borderRight='1.5px solid #DEE2E6'
                style={{ cursor: "pointer" }}>
                <Icon name='search' width={30} height={30} />
            </Box>
            <InputField
                as='input'
                onChange={onChange}
                value={value}
                type='text'
                placeholder='Search'
                flex='1'
                pl={12}
                height={40}
            />
        </Box>
    );
}
