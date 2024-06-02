import React, { Component } from 'react';
import SocketService from './App.socket'
import './App.brokers.css'

export default class Brokers extends React.Component {
    constructor(props) {
        super(props);
        this.state = { brokersList: [], name: "", surname: "", startCash: 0};
        this.socket = SocketService;
    }

    componentDidMount(){
        fetch('http://localhost:3001/brokers', { method: 'GET' })
            .then(response => response.json())
            .then(value => this.setState({ brokersList: value.Brokers}))
            .catch(error => console.log("brokers error: " + error));
    }

    handleInputChange = (e) => {
        if(e.target.attributes.class && e.target.attributes.class.value === "invis-input"){
            if(Number.isNaN(Number(e.target.value)) || e.target.value < 0){
                alert("Некорректные данные!")
                return;
            }

            let tmp = this.state.brokersList;
            tmp[e.target.id].money = Number(e.target.value);
            this.setState({ brokersList: tmp})

            fetch('http://localhost:3001/updateBrokersList',{
                method: 'POST',
                body: JSON.stringify(tmp),
                headers: {
                    'Content-Type': 'application/json'
            }}); 

            return;
        }

        switch(e.target.id){
            case "name":
                this.setState({name: e.target.value});
                break;
            case "surname":
                this.setState({surname: e.target.value});
                break;
            case "startCash":
                if(Number.isNaN(Number(e.target.value)) || e.target.value < 0){
                    alert("Некорректные данные!")
                    break;
                }
                this.setState({startCash: e.target.value});
                break;
        }
    }

    addBroker = () => { 
        let newBroker = {
            id: this.state.brokersList[this.state.brokersList.length - 1].id + 1,
            fullName: this.state.surname + ' ' + this.state.name,
            money: this.state.startCash, 
            stocks: []
        };

        fetch('http://localhost:3001/createBroker', {
            method: 'POST',
            body: JSON.stringify(newBroker),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(value => this.setState({ brokersList: value.Brokers}));
    }

    deleteBroker = (e) => {
        fetch('http://localhost:3001/deleteBroker', {
            method: 'POST',
            body: JSON.stringify({id : e.target.id}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(value => this.setState({ brokersList: value.Brokers}));
    }

    check = () => {
        console.log("another-check");
    } 

    render() {
        return (
            <div class='main-div'>
                <div class='brokers-list'>
                    {this.state.brokersList.map(broker => (
                        <div class='broker'>
                            <span class='broker-name'>{broker.fullName}</span> 
                            <div class='broker-cash-delete'>
                                <input class="invis-input" id={broker.id} value={broker.money} onChange={this.handleInputChange}/>
                                <button  id={broker.id} onClick={this.deleteBroker}>удалить</button> 
                            </div>
                        </div>
                    ))}
                </div>
                <div class='new-broker'>
                    <p>Имя:</p>
                    <input id="name" value={this.state.name} onChange={this.handleInputChange}/>
                    <p>Фамилия:</p>
                    <input id="surname" value={this.state.surname} onChange={this.handleInputChange} />
                    <p>Стартовый капитал:</p>
                    <input id="startCash" value={this.state.startCash} onChange={this.handleInputChange} />
                    <button onClick={this.addBroker}>Создать</button>
                </div>
            </div>
        );
    }
}
