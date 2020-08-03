import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../shared/admin.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  accessForm: FormGroup;
  failedLogin: boolean;
  error: any;
  loginSub: Subscription;

  constructor(private adminService: AdminService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginSub = this.adminService.loginSubject.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/admin', 'admin-home']).then();
      }
    });

    this.accessForm = new FormGroup({
      bguUsername: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required
      ])
    });
  }

  onSubmit() {
    const username: string = this.accessForm.get('bguUsername').value;
    const password: string = this.accessForm.get('password').value;
    this.adminService.logIn(username, password);
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }
}
