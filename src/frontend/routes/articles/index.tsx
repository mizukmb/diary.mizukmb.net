import React = require('react');
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components'

const Title = styled.h1`
font-size: 2.5em;
text-align: center;
`
const Body = styled.div`
margin: 10px 200px;
`

export const Articles = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const {articleName} = useParams();
    const domparser = new DOMParser();
    const parsedContent = domparser.parseFromString(content, 'text/html').body.innerHTML;

    useEffect(() => {
        const host = process.env.BACKEND_HOST;
        const port = process.env.BACKEND_PORT;
        fetch(`http://${host}:${port}/articles/${articleName}`)
                .then(response => response.text())
                .then(text => {
                    const json = JSON.parse(text);
                    setTitle(b64_to_utf8(json.title));
                    setContent(b64_to_utf8(json.body));
                });
    }, []);

    return (
        <div>  
            <Title>{title}</Title>
            <Body dangerouslySetInnerHTML={{__html: parsedContent}}></Body>
        </div>
    );
}

// https://developer.mozilla.org/ja/docs/Web/API/WindowBase64/btoa#Unicode_Strings
const b64_to_utf8 = (str: string) => {
    return decodeURIComponent(escape(window.atob(str)));
}