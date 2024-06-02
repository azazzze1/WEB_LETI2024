import React, { Component } from 'react';
import { Chart } from "chart.js/auto"
import './App.stocks.css'

export default class Stocks extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stocksList: [] };
    }

    componentDidMount() {
        fetch('http://localhost:3001/stocks', { method: 'GET' })
            .then(response => response.json())
            .then(value => this.setState({ stocksList: value.Stocks }))
            .catch(error => console.log("stocks error: " + error));
    }

    showStock = (e) => {
        let element = document.querySelector('.chart-plus-table-div');
        if (element) {
            element.parentNode.removeChild(element);
        }

        let data = {
            symbol: e.target.id
        };
        fetch('http://localhost:3001/showStock',{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
        }}).then(response => response.json())
        .then(value => {
            const ctx = document.getElementById(e.target.id);
            let div = document.createElement('div');
            div.classList.add('chart-plus-table-div');
            ctx.parentNode.insertBefore(div, ctx.nextSibling);


            var canvas = document.createElement('canvas');
            canvas.classList.add('chart-diag');
            canvas.width = 400;
            canvas.height = 200;
            div.appendChild(canvas);

            const data = {
                labels: value.labels,
                datasets: [{
                    label: e.target.id,
                    backgroundColor: 'rgb(0, 102, 255)',
                    borderColor: 'rgb(0, 102, 255)',
                    data: value.values,
                }]
            }
            const myChart = new Chart(canvas, {
                type: 'line',
                data
            });

            let table = document.createElement('table');
            let div2 = document.createElement('div');
            div2.classList.add('diag-table-div'); 
            div.appendChild(div2);
            table.classList.add('diag-table')

            for (let i = 0; i < value.labels.length; i++) {
                let row = table.insertRow();
                let cell = row.insertCell();
                cell.classList.add('diag-table-cell')
                cell.textContent = value.labels[i];
                cell = row.insertCell();
                cell.classList.add('diag-table-cell')
                cell.textContent = value.values[i] + '$';
            }

            div2.appendChild(table); 
        }); 
    }

    render() {
        return (
            <div>
                {this.state.stocksList.map(stock => (
                    <p class='stock-div' id={stock.symbol} onClick={this.showStock}>{stock.symbol} - {stock.company}</p>
                ))}
            </div>
        );
    }
}
