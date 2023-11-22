import { Component } from '@angular/core';
import { DataService } from './data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})

export class LoginComponent {
    loginEmail: string = "";
    password: string = "";  
    comment: string = ""; 

    usersStorage: any;

    constructor(public dataService: DataService,
        private cookieService: CookieService) {}

    ngOnInit(){
        this.dataService.getUserStorage().subscribe((res)=>{
            let _userData = JSON.stringify(res);
            let userData = JSON.parse(_userData) || [];
            this.usersStorage = userData;
        })
    }

    searchUser(){
        let userData = this.usersStorage;
        this.dataService.usersStorage = userData;

        for(let i = 0; i < userData.length; ++i){
            if(userData[i].email == this.loginEmail && userData[i].password == this.password){
                this.comment = "Вход выполнен!";
                this.cookieService.set('userID', (i+1).toString());
                this.cookieService.set('username', userData[i].surname + " " + userData[i].name);
                location.href="/";
                return;
            }
        }
        this.comment = "Неверный пароль или логин!";
    }

    register(){
        location.href="/register"
    }

}