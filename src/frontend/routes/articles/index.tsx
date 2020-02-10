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
                    setTitle(json.title);
                    setContent(json.body);
                });
    }, []);

    return (
        <div>  
            <Title>{title}</Title>
            <Body dangerouslySetInnerHTML={{__html: parsedContent}}></Body>
        </div>
    );
}