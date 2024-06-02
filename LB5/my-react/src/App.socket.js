import io, { Socket } from "socket.io-client"

export default class SocketService{
    static socket = null;

    static CreateConnection(){
        this.socket = io('http://localhost:3001');

        this.socket.on("connect", () => {
            console.log("react connected");
        })
    }

    static newBroker(name, surname, startCash){
        let newBroker = {
            id: 0,
            fullName: surname + ' ' + name,
            money: startCash, 
            stocks: [{}]
        };

        this.socket.emit("createBroker", ({"newBroker": newBroker}));
    }
}