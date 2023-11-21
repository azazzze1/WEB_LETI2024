import { Component } from '@angular/core';
import { DataService } from './data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})

export class HeaderComponent {
    usersStorage: object = [];

    constructor(public dataService: DataService,
        private cookieService: CookieService) {}

    userName : string = "Гостевой аккаунт";
    userID : any = '0';
    isAdmin : boolean = false;
    
    ngOnInit(){
        this.userName = this.cookieService.get('username');
        this.userID = this.cookieService.get('userID');
        
        this.dataService.getUserStorage().subscribe((res)=>{
            let _userData = JSON.stringify(res);
            let userData = JSON.parse(_userData) || [];
            this.usersStorage = userData;

            this.isAdmin = userData[this.userID-1].role == "admin" ? true : false;
        })
    }

    ngOnDestroy(){
        this.dataService.curUserFullName.unsubscribe();
        this.dataService.curUserID.unsubscribe();
    }
    
}