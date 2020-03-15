import React = require('react');
import styled from 'styled-components'

const Li = styled.a`
color: black;
`

export const Header = () => {
    return (
        <header>
            <Li href="/">diary.mizukmb.net</Li>
        </header>
    );
};