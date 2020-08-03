import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AdminService} from '../shared/admin.service';

@Injectable({providedIn: 'root'})
export class TempGuard implements CanActivate {
  constructor(private adminService: AdminService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.adminService.loggedIn) {
      return true;
    }
    return this.router.createUrlTree(['/admin', 'login']);
  }

}
