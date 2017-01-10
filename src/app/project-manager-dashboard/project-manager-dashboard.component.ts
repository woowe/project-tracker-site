import { Component, OnInit, trigger, state, style, transition, keyframes, animate } from '@angular/core';
import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';
import { MdDialog, MdDialogRef } from '@angular/material';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-project-manager-dashboard',
  templateUrl: './project-manager-dashboard.component.html',
  styleUrls: ['./project-manager-dashboard.component.css']
})
export class ProjectManagerDashboardComponent implements OnInit {

  info: FirebaseObjectObservable<any>;
  dealerships: BehaviorSubject<any>;

  constructor(private productLogos: ProductLogosService, public af: AngularFire, private router: Router,
              private userInfo: UserInfoService, public dialog: MdDialog) { }

  ngOnInit() {
    this.userInfo.login_observable.subscribe(loggedIn => {
      console.log('Login observable: ', loggedIn);
      if(loggedIn) {
        this.info = this.userInfo.info;
        this.dealerships = this.userInfo.dealerships;
      }
    });
  }

  openDialog() {
    console.log('open dialog clicked!');
    let dialogRef = this.dialog.open(AddDealershipDialog, {
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './add-dealership-dialog.component.html',
  styleUrls: ['./add-dealership-dialog.component.css'],
  animations: [
    trigger('productState', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(300, keyframes([
          style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
          style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
          style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate(300, keyframes([
          style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
          style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
          style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class AddDealershipDialog {
  products: any[] = [];
  scroll_state: string = "scrolled-down";
  selected_tab: number = 0;
  product_more_info: any = null;
  constructor(private productLogos: ProductLogosService, public dialogRef: MdDialogRef<AddDealershipDialog>) {
    this.products = this.productLogos.getProductLogos().map(v => { return { name: v.alt, selected: false }; });
  }
  toggleProductSelect(idx: number) {
    if(this.products[idx]) {
      this.products[idx].selected = !this.products[idx].selected;
    }
  }
  selectProduct(idx: number) {
    if(this.products[idx]) {
      this.products[idx].selected = true;
    }
  }

  getProductCSS(idx: number) {
    if(this.products[idx]) {
      var sp = this.products[idx];
      return {
        backgroundColor: sp.selected ? '#2196F3' : '#fff',
        color: sp.selected ? '#fff' : '#2196F3'
      };
    }
    return null;
  }

  gotoTab(tab_num: number, idx: number) {
    this.selected_tab = tab_num;
    console.log('Selected tab: ', this.selected_tab);
    this.product_more_info = this.products[idx];
  }
}
