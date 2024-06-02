import { Component } from '@angular/core';
import { DataService } from './data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-friends',
    templateUrl: 'friends.component.html',
    styleUrls: ["friends.component.less"]
})

export class FriendsComponent {
    usersStorage: any;
    userID : any = this.cookieService.get('userID'); 

    public friendList: any = [{}]; 
    
    constructor(public dataService: DataService,
        private cookieService: CookieService) {}

    ngOnInit(){
        this.dataService.getUserStorage().subscribe((res)=>{
            let _userData = JSON.stringify(res);
            let userData = JSON.parse(_userData) || [];
            this.usersStorage = userData;
            
            this.friendList.pop();

            let friendsIDs = JSON.parse(userData[this.userID-1].friends);
            for(let i of friendsIDs){
                this.friendList.push(userData[i-1]);
            }
        })
    }
}
