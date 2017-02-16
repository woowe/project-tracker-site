import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserInfoService } from '../UserInfo/user-info.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private user_info: UserInfoService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.user_info.loggedIn) {

      if( environment.type === 'dev' ) {
        var cust_routes: Array<string> = ["/product-selection", "/milestone-tracker"];
        var pm_routes: Array<string> = ["/pm-dashboard"];
        var username = "test_pm@dealersocket.com";
        var password = "projecttracker";
        if(cust_routes.indexOf(state.url) >= 0) {
          var username = "test_cust@dealersocket.com";
        }
        this.user_info.login(username, password,
        success => {
          console.log("Firebase success with AuthGuard login");
        },
        error => {
          console.log("Firebase error with AuthGuard login");
        });

        return true;
      }

      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}
