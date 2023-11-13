import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, Subject} from "rxjs";
import {throwError} from "rxjs";
import {User} from "./user.model";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";


export interface AuthResponseData {
  idToken: string,
  email: string
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean,
}


@Injectable({
  providedIn: 'root'
})


export class AuthService {


  user = new BehaviorSubject<User>(null);
  token: string = null;
  private tokenExpirationTimer: any;


  constructor(private http: HttpClient, private router: Router) {
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBxEtsNdvqZnY9kAWiZT813t5HezxRzNk4'
      , {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBxEtsNdvqZnY9kAWiZT813t5HezxRzNk4', {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }


  autoLogin() {

    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string,
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration)
    }

  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {

   this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
    console.log(expirationDuration)
  }

  private handleAuthentication(email: string, userId: string, token: string, expires: number) {
    const expirationData = new Date(new Date().getTime() + expires * 1000);
    const user = new User(email, userId, token, expirationData);
    this.user.next(user);
    this.autoLogout(expires * 1000)
    localStorage.setItem('userData', JSON.stringify(user))
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    console.log(errorRes);

    const errorCode = errorRes.error.error.message;
    switch (errorCode) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Check your email or password';
        break
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email one does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password.';
        break;
    }

    return throwError(errorMessage);
  }


}
