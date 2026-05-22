import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Usermodule } from './usermodule';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  redirectUrl:any;
 
  baseUrl:string = "http://localhost:8081";

@Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  Usermodule: any;
  constructor(private httpClient : HttpClient) { }  // le service userlogin qui envoi le formulaire login a l'api login.php 
  public userlogin(email: any, password: any) {
    return this.httpClient.post<any>(this.baseUrl + '/login.php', { email, password })
        .pipe(map(Usermodule => {      //recuperer les donnees du login et le met en format json 
            this.setToken(Usermodule[0].email);
            
            this.getLoggedInName.emit(true);
            return Usermodule;
        }));
}
// service pour mettre a jours le mot de passe modifier d'un utilisateur 
public updateuserlogin(email: any,pwd: any) {
  return this.httpClient.post<any>(this.baseUrl + '/ForgetPasswordUpdate.php', { email,pwd })
    .pipe(map(Usermodule => {
          return Usermodule;
      }));
    } 
  
                 // le service  userregistration qui envoi le formulaire registration a l''api registration.php

public userregistration(name: any,email: any,pwd: any) {  
  return this.httpClient.post<any>(this.baseUrl + '/registration.php', { name,email, pwd })
      .pipe(map(Usermodule => {   //recuperer les donnees  et le met en format json 
          return Usermodule;
      }));
}

            //le service pour mettre a jours les donnees d'un users
public updateuserdetails(id: any,name: any,email: any,pwd: any,Authorization: any,Telechargement:any) {
  return this.httpClient.post<any>(this.baseUrl + '/updateuser.php', { id,name,email,pwd ,Authorization,Telechargement})
    .pipe(map(Usermodule => {   //recuperer les donnees  et le met en format json 
      
          return Usermodule;
      }));
 
}
        //service pour mettre a jours certaines donnees d'un users 
public AuthorizeUpdate(id: any,name: any,email: any,pwd: any,Authorization:any) {
  return this.httpClient.post<any>(this.baseUrl + '/AuthorizeUpdate.php', { id,email,pwd,Authorization})
    .pipe(map(Usermodule => {  //recuperer les donnees  et le met en format json 
             
          return Usermodule;
      }));
   
}     


   // service pour supprimer un utilisateur 
removeUser(empid: number): Observable<Usermodule[]> {
  return this.httpClient.get<Usermodule[]>(this.baseUrl+'/deletedata.php?empid='+empid );
}
   //service pour recuperer un user par son ID
public getUserId(empid: number): Observable<Usermodule[]>
  {
    return this.httpClient.get<Usermodule[]>(
      this.baseUrl + '/getdataone.php?'+ 'empid=' + empid 
      );
  }
   //service pour recuperer un user par son email

  public getUser(Email: any ): Observable<Usermodule[]>
  {
    return this.httpClient.get<Usermodule[]>( this.baseUrl + '/getUserStatus.php?'+'Email='+Email)



  }

  // service pour verifier l'existe d'un mail d'un user 
  public checkUserMail(Email: any ): Observable<Usermodule[]>
  {
    return this.httpClient.get<Usermodule[]>( this.baseUrl + '/checkmail.php?'+'Email='+Email).
    pipe(map (Usermodule=>
    {
      return Usermodule;
    }

    ))
  }
      //service pour envoyer un mail de mot de passe oublié a un user : parametre =email

public UserPasswordReset(email: any) {
  return this.httpClient.post<any>(this.baseUrl + '/forgetpassword.php', { email })
      .pipe(map(Usermodule => {
          return Usermodule;
      }));
}
   // service pour verifier status d'un user
  public userLoginActive(Email: any ): Observable<Usermodule[]>
  {
    return this.httpClient.get<Usermodule[]>( this.baseUrl + '/loginActive.php?'+'Email='+Email)
  }
      //service pour recuperer tous les users 
 
getAllUsers(id: number | undefined) : Observable<Usermodule[] > {
  return this.httpClient.get<Usermodule[]>(this.baseUrl+'/getdata.php');
}
 


// set token dans localstorage
setToken(token: string) {
  localStorage.setItem('token', token);
}
setAuth(auth : string){
  localStorage.setItem('auth',auth);

}
setTel(tel : string){
  localStorage.setItem('tel',tel);

}
 setMail(mail : string)
 {
       localStorage.setItem('mail',mail);
 }
 setStatus(Status : string)
 {
       localStorage.setItem('mail',Status);
 }
// get token  dans localstorage

 getMail()
 {
   return  localStorage.getItem('mail');
 }
 getStatus()
 {
   return  localStorage.getItem('Status');
 }

 getToken() {
  return localStorage.getItem('token');
}
getAuth()
{
  return localStorage.getItem('auth');
}
getTel()
{
  return localStorage.getItem('tel');
}

//delete token  dans localstorage

deleteAuth()
{
  localStorage.removeItem('auth');
}

deleteStatus()
{
  localStorage.removeItem('Status');
}
deleteMail()
{
  localStorage.removeItem('mail');
}


deleteTel()
{
  localStorage.removeItem('tel');
}
 

 
deleteToken() {
  localStorage.removeItem('token');
}
 
// verifier si un user est login

isLoggedIn() {
  const usertoken = this.getToken();
  if (usertoken != null) {
    return true
  }
  return false;
}
  // verfier si il ya login et cest un admin 
isAdmin()
{
  var localEmail=this.getToken();
  if(localEmail=='projetdefindetude024@gmail.com')  // ici le mail peut etre changer  au mail de l'admin
  {
    return true;
  }
  else{
    return false;
  }
} 
 //verifier si il a l'authorisiation

hasPermission()
{
  var localEmail=this.getAuth();
  if(localEmail=='1')
  {
    return true;
  }
  else{
    return false;
  }
}

// verifier si le mail est confirmer
  emailConfirmed()
  {
    var t=this.getStatus()
    if(t=='active')
    {
      return true
    }
      return false;
  }
//supprimer tous les données de localstorage

clearAll()
{
  localStorage.clear();
}


}
 