import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Events } from '@ionic/angular';




@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public registeredUsers: any;
  public user: any = null;
  public isLogged: boolean = false;
  public pID: any;

  
 //ssl secured 
  public serverURL: string = 'https://51.75.76.50:3030';

  constructor(private http: HttpClient, private Events: Events) { }

  //header for the http posts/gets
  public requestOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept': 'application/json'
      })
    };


  registerUser(user) {
    this.http.post( this.serverURL + '/registerUser', user, this.requestOptions ).subscribe((response) => {
        console.log(response);
        this.setUser(response);
    },
    err => {
      this.errorHandler(err);    
    });

   
  }



  getUsers() {
    return this.http.get(this.serverURL + '/products');
  }

  
  getLogin(loginForm) {
   this.isLogged = false;
    
    this.http.post(this.serverURL +  '/loginUser', loginForm, this.requestOptions ).subscribe((response) => {
     
     console.log(response["pID"] );
     console.log(response["isLogged"]);
     console.log(response["user"]);
      if(response["isLogged"] == "logged"){ 
        this.pID = response["pID"];
        this.user = response["user"]; 
        this.Events.publish('user:logged', true);   
        this.Events.publish('refresh-name', response["user"].fullname);
        this.Events.publish('refresh-address', response["user"].address);   
        this.isLogged = true;
      }
  },
  err => {
    this.errorHandler(err);    
  });
    return this.isLogged ;
  }


  editUser(name, email, address) {
    
    let editedUser = {'fullname' : name, 'email' : email, 'address': address, 'pID' : this.pID  }
  
    this.http.post(this.serverURL +  '/editUser', editedUser, this.requestOptions ).subscribe((response) => {
        console.log(response);
        this.setUser(response);
    },
    err => {
      this.errorHandler(err);    
    });
    return "edited";

  }

  getCars(){
      return this.http.get(this.serverURL +  '/allCars', this.requestOptions );
  }

  getQueryCars(query){
     return  this.http.get(this.serverURL +  '/queryCars/' + query , this.requestOptions );
  }

  getRegisterCar(car,url){
    
       
      this.http.post(this.serverURL +  '/registerCar' ,  {'car': car , 'url': url} , this.requestOptions ).subscribe((response) => {
      console.log(response);
      return  "hi";
  },
  err => {
    this.errorHandler(err);    
  });

  }





  setUser(newUser) {
    console.log(newUser);
    this.user = newUser;
    this.Events.publish('refresh-name');
    this.Events.publish('refresh-name',newUser["fullname"]);
    this.Events.publish('refresh-address', newUser["address"]); 
    console.log(this.user.id);
  }

  getRegisteredUsers() {
    return this.registeredUsers;
  }

  
  setRegisteredUsers(rL) {
    this.registeredUsers = rL;   
  }

  getUserID() {
    if(this.user != null){
      
      return this.user.id;
    }
    return 'name';
  }

  getUserName(){
    if(this.user != null){
      console.log(this.user.fullname);
      return this.user.fullname;
    }
    return 'fullname';
  }

  getUserEmail(){
    if(this.user != null){
      return this.user.email;
    }
    return 'email';
  }

  getUserAddress(){
    if(this.user != null){
      return this.user.address;
    }
    return 'address';
  }

  getBuyCars(query){
    return  this.http.get(this.serverURL +  '/buyCars/' + query , this.requestOptions );
 }

  getUserPassword(){
    if(this.user != null){
      return this.user.password;
    }
    return 'name';
  }

  
  errorHandler(err){
    console.log(err);
  }


}
