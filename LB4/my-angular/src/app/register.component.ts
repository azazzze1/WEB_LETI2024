import { Component } from '@angular/core';
import { DataService } from './data.service';
import { Data } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    name: string = "Иван";
    surname: string = "Иванов";
    patronymic: string = "Иванович";
    email: string = "example@gmail.com";
    password: string = "";
    checkPassword: string = "";
    birthdate: string = "2004-04-08";

    comment: string = "";

    usersStorage: any;

    constructor(public dataService: DataService) {}

    ngOnInit(){
        this.dataService.getUserStorage().subscribe((res)=>{
            let _userData = JSON.stringify(res);
            let userData = JSON.parse(_userData) || [];
            this.usersStorage = userData;
        })
    }

    validateEmail(checkEmail : string) : boolean {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(checkEmail);
    }

    registerUser(){
        let id = this.usersStorage.length;

        if(!(this.name && this.surname && this.patronymic && this.email && this.birthdate && this.password && this.checkPassword)){
            this.comment = "Не все поля заполнены!"
            return;
        }

        if(this.password != this.checkPassword){
            this.comment = "Пароли не совпадают!";
            return;
        }

        if(!this.validateEmail(this.email)){
            this.comment = "Данная почта некорректна!";
            return; 
        }

        for(let user of this.usersStorage){
            if(user.email == this.email){
                this.comment = "Данная почта уже занята!";
                return; 
            }
        }

        let newUser = {
            "id": (id+1).toString(),
            "name": this.name,
            "surname": this.surname,
            "patronymic": this.patronymic,
            "email": this.email,
            "password": this.password,
            "birthdate": this.birthdate,
            "role": "user",
            "status": "unconfirmed",
            "friends": "[]",
            "post": "[]"
        }

        this.usersStorage.push(newUser);
        this.dataService.usersStorage = this.usersStorage;

        this.dataService.sendUserListStorage(this.usersStorage).subscribe();
    }


   

}