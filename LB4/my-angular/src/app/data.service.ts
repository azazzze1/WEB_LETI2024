import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';


@Injectable({providedIn: 'root'})
export class DataService{

    public usersStorage = [{}];

    public curUserID = new BehaviorSubject(0);
    public curUserID$ : Observable<number> = this.curUserID;

    public curUserFullName = new BehaviorSubject("Гостевой аккаунт");
    public curUserFullName$ : Observable<string> = this.curUserFullName;

    constructor(private http: HttpClient){ }

    getUserStorage() : Observable<object>{
        return this.http.get<object>('http://localhost:3000/usersListStorage.json');
    }

    getUserDialog(firstUserID : number, secondUserID : number) : Observable<string>{
        let ids = [firstUserID, secondUserID];
        ids.sort((a : number, b : number) => {return a-b;});
        let name = "d" + ids[0] + "-" + ids[1] + ".json"; 
        return this.http.get<string>('http://localhost:3000/' + name.toString());
    }

    sendUserListStorage(newList : [{}]) {
        console.log("DATA", newList);
        const params = new HttpParams().set('newUserListParam', JSON.stringify(newList));
        return this.http.get('http://localhost:3000/changeUserListStorage', {params}); 
    }

}

