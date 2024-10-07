

import styled from 'styled-components';

export const InputField = styled.input`
    margin: 10px 0;
    padding: 14px 10px;
    font-size: 16px;
    width: 440px;
    outline: none;
    border: 1px solid #dee2e6;
    transition: 0.2s;
    border-radius: 4px;
    display: block;

    &:focus {
        transition: 0.2s;
        box-shadow: 0 0 8px 3px rgba(0, 123, 255, 0.07);
    }
`;