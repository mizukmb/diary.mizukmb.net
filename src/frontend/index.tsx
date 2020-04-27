import React = require('react');
import { useEffect, useState } from 'react';
import ReactDOM = require('react-dom');
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import { Articles } from './routes/articles';
import { Header } from './components/header';

const TitleList = () => {
    const [contents, setContents] = useState([]);
    const protocol = process.env.BACKEND_PROTOCOL;
    const host = process.env.BACKEND_HOST;
    const port = process.env.BACKEND_PORT;

    useEffect(() => {
        fetch(`${protocol}://${host}:${port}/`)
                .then(response => response.text())
                .then(text => {
                    const json = JSON.parse(text);
                    const path = `/articles/{content}`
                    const a = json.map((content) =>
                        <li key={content}>
                            <Link to={`/articles/${content}`}>{content}</Link>
                        </li>
                    );
                    setContents(a);
                });
    }, []);

    return (
        <div>
            <ul>
                {contents}
            </ul>
        </div>
    );
}

const Index = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/articles/:articleName">
                    <Articles />
                </Route>
                <Route path="/">
                    <TitleList />
                </Route>
            </Switch>
        </Router>
    );
}

ReactDOM.render(
    <Index />,
    document.getElementById('root')
);
