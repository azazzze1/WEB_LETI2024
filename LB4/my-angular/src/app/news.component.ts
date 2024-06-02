import { Component } from '@angular/core';
import { DataService } from './data.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-news',
    templateUrl: 'news.component.html'
})


export class NewsComponent {
    usersStorage: any;
    userID : any = this.cookieService.get('userID'); 

    lol: number = 0;

    userPost = {
                "id": 0,
                "author": "",
                "text": "",
                "user": 0
            };

    public userPostsList : any = [{}];

    public userPostsString : any;
    
    constructor(public dataService: DataService,
        private cookieService: CookieService) {}

    ngOnInit(){
        this.dataService.getUserStorage().subscribe((res)=>{
            let _userData = JSON.stringify(res);
            let userData = JSON.parse(_userData) || [];
            this.usersStorage = userData;

            let countID = 1;
            this.userPostsList.pop();

            for(let friend of JSON.parse(userData[this.userID - 1].friends)){
                for(let post of JSON.parse(userData[friend-1].post)){
                    this.userPostsList.push({"id": countID++, "author": userData[friend - 1].name + " " + userData[friend - 1].surname, "text": post, "user": friend});
                }          
                countID = 1;
            }
    
            let comp = ((a : any, b : any) => {
                return (b.id-a.id); 
            });
    
            this.userPostsList.sort(comp);
            
            this.userPostsString = JSON.stringify(this.userPostsList);
            console.log(this.userPostsList);
        })
    }
}
