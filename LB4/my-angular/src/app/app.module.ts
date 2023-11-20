import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { NewsComponent } from './news.component';
import { FriendsComponent } from './friends.component';
import { HttpClientModule } from '@angular/common/http'
import { MessengerComponent } from './messenger.component';

const appRoutes: Routes =[
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'news', component: NewsComponent},
  { path: 'friends', component: FriendsComponent},
  { path: 'messenger', component: MessengerComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    NewsComponent,
    FriendsComponent,
    MessengerComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
