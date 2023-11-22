import { Injectable } from "@angular/core";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { io, Socket } from "socket.io-client";

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    socket: Socket;

    constructor(){}

    connect(){
        this.socket = io('http://localhost:3001');
    }

    sendMessage(userID : number, friendID : number, msg : string){
        this.socket.emit("chatMsg", ({"userID": userID, "friendID": friendID, "msg": msg}));
    }
}