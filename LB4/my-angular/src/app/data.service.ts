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

    sendUserDialog(userID : number, friendID : number, messenge : string) : Observable<string>{
        let ids = [userID, friendID];
        ids.sort((a : number, b : number) => {return a-b;});
        let name = "d" + ids[0] + "-" + ids[1] + ".json"; 
        
        return this.http.post<string>('http://localhost:3000/sendDialog', {fileName: name, ID: userID, text: messenge});
    }

    getUserDialog(firstUserID : number, secondUserID : number) : Observable<string>{
        let ids = [firstUserID, secondUserID];
        ids.sort((a : number, b : number) => {return a-b;});
        let name = "d" + ids[0] + "-" + ids[1] + ".json"; 
        return this.http.get<string>('http://localhost:3000/' + name.toString());
    }

    changeUserID(newID : number) : void {
        this.curUserID.next(newID);
    }

    changeUserFullName(newName : string) : void{
        this.curUserFullName.next(newName); 
    }

    sendUserListStorage(newList : [{}]) {
        console.log("DATA", newList);
        const params = new HttpParams().set('newUserListParam', JSON.stringify(newList));
        return this.http.get('http://localhost:3000/changeUserListStorage', {params}); 
    }

    checkParams() : void{
        console.log("private: ", this.curUserFullName, this.curUserID);
        console.log("public: ", this.curUserFullName$, this.curUserID$);
    }

}

