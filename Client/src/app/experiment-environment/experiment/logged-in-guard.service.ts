import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {UserService} from '../participant-login/user.service';

@Injectable({providedIn: 'root'})
export class LoggedInGuard implements CanActivate {
  constructor(private userService: UserService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const accessCode = route.params.accessCode;
    if (!accessCode) {
      alert('No access code');
      return this.router.createUrlTree(['/login']);
    }
    if (!this.userService.isLoggedIn) {
      const loginObservable = this.userService.loginSubject.pipe(take(1),
        map(isLoggedIn => {
          return isLoggedIn ? isLoggedIn : this.router.createUrlTree(['/login']);
        }));
      this.userService.logIn(accessCode);
      return loginObservable;
    }
    return true;
  }

}
