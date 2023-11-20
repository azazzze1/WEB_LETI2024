import { Component } from '@angular/core';
import { DataService } from './data.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from './socket.service';

@Component({
    selector: 'app-messenger',
    templateUrl: 'messenger.component.html',
    styleUrls: ["friends.component.less"]
})


export class MessengerComponent {
    usersStorage: any;
    messenge : string = "";
    curFriendID : number = 0;

    userDialogs: any = [{}];


    currentDialog : any = {}
    userID : any = this.cookieService.get('userID'); 

    friendList : any = [{}];
    
    constructor(public dataService: DataService,
        private cookieService: CookieService,
        private socketService: SocketService ) {}

    ngOnInit(){
        this.socketService.connect();

        this.dataService.getUserStorage().subscribe((res)=>{
            let _userData = JSON.stringify(res);
            let userData = JSON.parse(_userData) || [];
            this.usersStorage = userData;

            this.friendList.pop();
            this.userDialogs.pop();

            let friendsIDs = JSON.parse(userData[this.userID-1].friends);
            for(let i of friendsIDs){
                this.friendList.push(userData[i-1]);
            }

            for(let i of friendsIDs){             
                this.dataService.getUserDialog(this.userID, i).subscribe((res) => {
                    let friendDialog = {
                        "id": i,
                        "dialog": res 
                    } 
                    this.userDialogs.push(friendDialog);
                })
            }
        })
    }

    checkDialog(event : any){
        let eID = event.originalTarget.id;
        if(eID){
            for(let i of this.userDialogs){
                if(i.id == eID){
                    this.currentDialog = i.dialog;
                    this.curFriendID = eID;
                    break;
                }
            }
        }
    }

    sendMessage(userID : number, friendID : number = this.curFriendID, messenge : string = this.messenge){
        this.socketService.sendMessage(userID, friendID, messenge);

        this.socketService.socket.on("chatMsg", (msg) => {
            this.currentDialog = msg.msg;
        });
    }
}
