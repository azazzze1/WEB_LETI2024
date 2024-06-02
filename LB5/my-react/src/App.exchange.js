import React, { Component } from 'react';
import { Chart } from "chart.js/auto"
import SocketService from "./App.socket.js"
import './App.exchange.css'

export default class Exchange extends React.Component {
    constructor(props) {
        super(props);
        this.state = { stocksList: [], startDate: '2022-12-16', changeSpeed: 0};
    }

    componentDidMount() {
        SocketService.CreateConnection(); 
        fetch('http://localhost:3001/stocks', { method: 'GET' })
            .then(response => response.json())
            .then(value => this.setState({ stocksList: value.Stocks }))
            .catch(error => console.log("stocks error: " + error));

        SocketService.socket.on("Sale", (Kdata) => {
            var elements = document.querySelectorAll('.chart-diag');
            elements.forEach(element => {
                element.remove();
            });

            let Rdata = JSON.parse(Kdata); 

            console.log(Rdata);

            for(let stockSymbol in Rdata){
                console.log(stockSymbol);
                let labels = []; 
                let values = [];

                for(let i = 0; i < Rdata[stockSymbol].length; ++i){
                    labels.push(Rdata[stockSymbol][i].date);
                    values.push(Rdata[stockSymbol][i].price);
                }
    
                const ctx = document.querySelector('.chart-diag-div');
                var canvas = document.createElement('canvas');
                canvas.classList.add('chart-diag');
                ctx.appendChild(canvas);
                
                const data = {
                    labels: labels,
                    datasets: [{
                        label: stockSymbol,
                        backgroundColor: 'rgb(0, 102, 255)',
                        borderColor: 'rgb(0, 102, 255)',
                        data: values,
                    }]
                }

                const myChart = new Chart(canvas, {
                    type: 'line',
                    data
                }); 
            }
        });
    }

    showStock = (data, selectedStocks) => {
        for(let stockSymbol of selectedStocks){
            let labels = []; 
            let values = []; 
            for(let i = 0; i >= data[stockSymbol]; ++i){
                labels.push(data[stockSymbol][i].date);
                values.push(data[stockSymbol][i].price);
            }

            var elements = document.querySelectorAll('.chart-diag');
            elements.forEach(element => {
                element.remove();
            });

            const ctx = document.querySelector('.chart-diag-div');
            var canvas = document.createElement('canvas');
            canvas.classList.add('chart-diag');
            ctx.appendChild(canvas);
            
            const data = {
                labels: labels,
                datasets: [{
                    label: stockSymbol,
                    backgroundColor: 'rgb(0, 102, 255)',
                    borderColor: 'rgb(0, 102, 255)',
                    data: values,
                }]
            }
            const myChart = new Chart(canvas, {
                type: 'line',
                data
            }); 
        }
    }

    handleInputChange = (e) => {
        switch(e.target.id){
            case "startDate":
                this.setState({startDate: e.target.value});
                break;
            case "changeSpeed":
                this.setState({changeSpeed: e.target.value});
                break;
        }
    }

    startSale = () => {
        const selectedStocks = [];
        const stocks = document.getElementsByName('stocks');
        stocks.forEach(stock => {
            if (stock.checked) {
                selectedStocks.push(stock.value);
            }
        });

        let data = {
            startDate: this.state.startDate,
            speedChange: this.state.changeSpeed,
            stocks: selectedStocks
        };

        fetch('http://localhost:3001/startSale',{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
        }});
    }

    stopSale = () => {
        fetch('http://localhost:3001/stopSale', {method: 'POST'}); 
    }

    render() {
        return (
            <div className='main-div'>
                <div class='exchange-start'>
                    <p>Дата начала торгов:</p> 
                    <input type="date" id="startDate" value={this.state.startDate} onChange={this.handleInputChange}/>
                    <p>Скорость торгов:</p> 
                    <input id="changeSpeed" value={this.state.changeSpeed} onChange={this.handleInputChange}/>
                    <form class="stocks-list">
                        {this.state.stocksList.map(stock => (
                            <label>
                                <input type="checkbox" name="stocks" value={stock.symbol}/>
                                {stock.symbol}
                            </label>
                        ))}
                    </form>
                    <div class='button'>
                        <button onClick={this.startSale}>Начать</button>
                        <button onClick={this.stopSale}>Закончить</button>
                    </div>
                </div>
                <div class="chart-diag-div"></div>
            </div>
        );
    }
}
