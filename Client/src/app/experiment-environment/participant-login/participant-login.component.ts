import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from './user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-participant-login',
  templateUrl: './participant-login.component.html',
  styleUrls: ['./participant-login.component.css']
})
export class ParticipantLoginComponent implements OnInit, OnDestroy {
  accessForm: FormGroup;
  failedLogin = false;
  error = null;
  private errorSubscription: Subscription;
  private loginSubscription: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.errorSubscription = this.userService.loginErrorSubject.subscribe(error => {
      this.error = error;
    });
    this.loginSubscription = this.userService.loginSubject.subscribe(isLoggedIn => {
      this.failedLogin = !isLoggedIn;
      if (isLoggedIn) {
        this.userService.navigateToExperiment();
      }
    });
    this.accessForm = new FormGroup({
      accessCode: new FormControl(null, [
        Validators.required,
        this.userService.legalAccessCode.bind(this.userService)
      ])
    });
  }

  onSubmit() {
    const accessCode: string = this.accessForm.get('accessCode').value;
    if (this.accessForm.valid) {
      this.userService.logIn(accessCode);
    }
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }
}
