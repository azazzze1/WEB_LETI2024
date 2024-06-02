import React, { Component } from 'react';
import "./App.header.css"

export default class App extends Component {
    render() {
        return (<div class = "header-container">
            <div class = "header-logo">
                <p>ТОРГОВАЯ БИРЖА</p>
            </div>
            <div class="header-small-elem">
                <a href="/brokers">Брокеры</a>
            </div>
            <div class="header-small-elem">
                <a href="/exchange">Биржа</a>
            </div>
            <div class="header-small-elem">
                <a href="/stocks">Акции</a>
            </div>
        </div>);
    }
}