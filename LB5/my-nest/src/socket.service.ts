import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({cors : { origin: "*" }})
export class SocketService implements OnGatewayConnection{
    clients : any = [];
  
    handleConnection(user: any) {
        console.log("user connected")
        this.clients.push(user)
    }

    handleDisconnect(user){
        for (let i = 0; i < this.clients.length; ++i) {
            if (this.clients[i] == user){
                this.clients.splice(i, 1);
                return;
            }
        }
    }

    BroadCast(event : string, message: any) {
        const broadCastMessage = JSON.stringify(message);
        for (let c of this.clients) {
          c.emit(event, broadCastMessage);
        }
    }
}