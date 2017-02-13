import { Component, OnInit, trigger, state, style, transition, keyframes, animate } from '@angular/core';
import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { ProjectManagerService } from '../services/ProjectManager/project-manager.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Observable, BehaviorSubject } from 'rxjs';

import { fuzzysearch } from '../utils/utils';

@Component({
  selector: 'app-project-manager-dashboard',
  templateUrl: './project-manager-dashboard.component.html',
  styleUrls: ['./project-manager-dashboard.component.css']
})
export class ProjectManagerDashboardComponent implements OnInit {

  info: any;
  dealerships: any[] = [];

  pm_observable: Observable<any> = null;

  constructor(private productLogos: ProductLogosService, public af: AngularFire, private router: Router,
              private userInfo: UserInfoService, public dialog: MdDialog, private projectManager: ProjectManagerService) { }

  ngOnInit() {
    Observable.from(this.userInfo.auth).filter(auth => auth != null).first().subscribe(auth => {
      console.log('Logged in', auth);
      this.getPMInfo(auth);
    });
  }

  getPMInfo(auth) {
    this.dealerships = [];
    this.pm_observable = this.projectManager.getProjectManagerInfo(auth);
    this.pm_observable
      .map((dealership, index) => {
        if(index >= this.projectManager._num_dealers) {
          this.dealerships = [];
          console.log('Throwing error....');
          throw new Error('error');
        }

        return (dealership);
      })
      .retry(99999)
      .subscribe( dealership => {
        console.log("DEALERSHIP INFO: ", dealership);

        if(this.info !== this.projectManager.info) {
          this.info = this.projectManager.info;
        }

        var found = null;
        for(var i = 0; i < this.dealerships.length; ++i) {
          if(this.dealerships[i].key == dealership.key) { found = i; break; }
        }

        if(found) {
          this.dealerships[found] = dealership
        } else {
          this.dealerships.push(dealership);
        }

        console.log("DEALERSHIPS: ", this.dealerships);
    });
  }

  getIcon(alt: string): string {
    switch(alt) {
      case "DealerSocket":
        return "trending_up";
      case "DealerFire":
        return "dashboard";
      case "Inventory+":
        return "search";
      case "iDMS":
        return "directions_car";
      case "Revenue Radar":
        return "attach_money";
      default:
        break;
    }
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

  getPrimaryUser(users: any[]) {
    for(let user of users) {
      if(user.role === "primary") {
        return user.user;
      }
    }
    return null;
  }

}

export interface User {
  name: string;
  email: string,
  phone: string
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
  milestone_templates: any[] = [];
  scroll_state: string = "scrolled-down";
  selected_tab: number = 0;
  product_more_info: any = { name: null, selected: false, selected_milestone: null, selected_type: null };

  _user: User;
  filtered_users: any[];
  added_users: any[] = [];
  primary_contact: boolean = false;

  dealership_uid: string = null;

  constructor(private productLogos: ProductLogosService, private userInfo: UserInfoService, public dialogRef: MdDialogRef<AddDealershipDialog>, private projectManager: ProjectManagerService) {
    this.products = this.productLogos.getProductLogos().map(v => { return { name: v.alt, selected: false, selected_milestone: null, selected_type: null }; });
    this.userInfo.getAllProductTemplates().subscribe(templates => {
      for(let template of templates){
        var p = this.products.findIndex(v => { return v.name === template.name });
        if(p >= 0) {
          this.products[p].p_template = template;
          this.products[p].selected_type = template.types[template.default_type];
          this.products[p].selected_type.idx = template.default_type;
        }
      }
      console.log('Product templates: ', this.products);
    });
    this.userInfo.getAllMilestoneTemplates().subscribe(templates => {
      this.milestone_templates = templates;
      for(let p of this.products) {
        if(p.selected_type) {
          p.selected_milestone = templates[p.selected_type.default_milestone_template];
          p.selected_milestone.idx = p.selected_type.default_milestone_template;
        }
      }
      console.log('Milestone templates: ', this.milestone_templates);
    });
  }

  searchUsers(event) {
    this.projectManager.getAllUsers().subscribe(users => {
      this.filtered_users = this.filterUsers(event.query, users);
    });
  }

  filterUsers(query, users) {
    var filtered = [];
    for(let user of users) {
      if(fuzzysearch(query, user.name))
        filtered.push(user);
    }
    return filtered;
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

    console.log(this.products);
  }

  addUser(name: string, email: string, phone: string, title: string) {
    if(this.dealership_uid) {
        this.projectManager.addUser({ name, email, phone, title, primary_contact: this.primary_contact }, this.dealership_uid);
    }
    this.added_users.push({ name, email, phone, title, primary_contact: this.primary_contact });
    this.projectManager.createCustomer(email);
  }

  removeUser(index: number) {
    console.log('removed user', index);
    this.added_users.splice(index, 1);
  }

  addDealership(name, address, city, state, zip) {
    this.projectManager.addDealership({name, address, city, state, zip}).then(ref => {
      this.dealership_uid = ref.path.o[1];
      console.log("DEALERSHIP UID: ", this.dealership_uid);

      this.projectManager.addDealershipToPm(this.dealership_uid);
      for(let user of this.added_users) {
        this.projectManager.addUser(user, this.dealership_uid);
      }

      for(let product of this.products) {
        // add milestones first
        if(product.selected_milestone) {
          this.projectManager.addMilestoneBuilding({
            milestones: product.selected_milestone.milestones,
            name: product.selected_milestone.name
          }).then(ref => {
            var m_uid = ref.path.o[1];
            // add product building
            // TODO: worry about product_type and type
            this.projectManager.addProductBuilding({
              name: product.name,
              template: m_uid,
              product_type: 0,
              activation: '2/25/2017',
              started: '1/2/2017'
            }, this.dealership_uid);
          });
        }
      }
    });
  }

  primaryContactChange() {
    this.primary_contact = !this.primary_contact;
  }
}
