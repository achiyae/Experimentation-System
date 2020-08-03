import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {ManageableExperimentsService} from '../manageable-experiments.service';
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class AdminService {
  loggedIn = false;
  loginSubject = new Subject<boolean>();
  username: string;

  constructor(private http: HttpClient,
              private experimentsService: ManageableExperimentsService) {
  }

  logIn(username: string, password: string) {
    const url = environment.serverUrl + 'admin/login';
    const data = {username, password};
    this.http.post<boolean>(url, data).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.username = username;
        this.loggedIn = isLoggedIn;
        this.loginSubject.next(isLoggedIn);
        this.experimentsService.setUsername(username);
        this.experimentsService.fetchExperiments(username);
      } else {
        alert('Wrong credentials');
      }
    });
  }

  addAdmin( email: string, password: string, cont) {
    const body = {
      email,
      password
    };
    const url = environment.serverUrl + 'admin/addAlly/' + this.username;
    this.http.post(url, body).subscribe(cont);
  }
}
