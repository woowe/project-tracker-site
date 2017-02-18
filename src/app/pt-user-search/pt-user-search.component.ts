import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  trigger,
  state,
  style,
  transition,
  animate,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { FormControl } from '@angular/forms';

import { fuzzysearch } from '../utils/utils';

@Component({
  selector: 'pt-user-search',
  templateUrl: './pt-user-search.component.html',
  styleUrls: ['./pt-user-search.component.css'],
  host: {
    '[class.pt-search-users]': 'true'
  },
  animations: [
    trigger('expandState', [
      state('out', style({height: 0})),
      state('in', style({height: "*"})),
      transition("in => out", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
      transition("out => in", animate("0.45s cubic-bezier(.4, 0, .2, 1)"))
    ]),
    trigger('collapserState', [
      state('expand', style({transform: 'rotateZ(180deg)'})),
      state('collapse', style({transform: 'rotateZ(0deg)'})),
      transition("expand <=> collapse", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
    ])
  ]
})
export class PtUserSearchComponent implements OnInit {

  info: any = { selected: {}, expanded: {} };

  users_model: any;
  added_users_model: any[] = [];
  @Output() addedUsersModelChange = new EventEmitter();

  constructor() {
    // this.addedUsersModelChange.subscribe(e => console.log('NEW VALUE: ', e));
  }

  ngOnInit() {
  }

  @Input()
  set usersModel(users: any) {
    this.users_model = users;
    for(let user in users) {
      if(!this.info.selected[(users as any).$key])
        this.info.selected[(user as any).$key] = false;
    }
  }

  @Input()
  get addedUsersModel() {
    return this.added_users_model;
  }

  set addedUsersModel(added_users: any) {
    this.added_users_model = added_users;
    for(let user in added_users) {
      this.info.selected[(user as any).$key] = true;
    }

    let keys = [];
    for(let k in this.info.selected)
      if(this.info.selected[k]) keys.push([k, this.info.selected[k]]);

    for(let k_v of keys) {
      let key = k_v[0];
      let val = k_v[1];
      if(val) {
        let user = this.users_model.find(u => u.$key === key);

        if(user) {
          let idx = this.added_users_model.findIndex(ad => {
            return (
              ad.name === user.name &&
              ad.email === user.email &&
              ad.phone === user.phone &&
              ad.title === user.title &&
              ad.primary_contact === user.primary_contact
            );
          });

          if( idx === -1 ) {
            this.info.selected[key] = false;
          }
        }

      }
    }
    this.addedUsersModelChange.emit(this.added_users_model);
  }

  filterUsers(query: string, users) {
    var filtered = [];
    for(let user of users) {
      if(fuzzysearch(query, user.name))
        filtered.push(user);
    }
    return filtered;
  }

  addUser(key: string) {
    let user = this.users_model.find(u => u.$key === key);

    if(!user) { return; }

    let idx = this.added_users_model.findIndex(ad => {
      return (
        ad.name === user.name &&
        ad.email === user.email &&
        ad.phone === user.phone &&
        ad.title === user.title &&
        ad.primary_contact === user.primary_contact
      );
    });

    // console.log(key, idx, this.info.selected[key], user);
    if(this.info.selected[key] && user && idx === -1) {
      this.added_users_model.push({
        name: user.name,
        email: user.email,
        phone: user.phone,
        title: user.title,
        primary_contact: user.primary_contact
      });

      this.addedUsersModelChange.emit(this.added_users_model);
    } else if(idx >= 0) {
      this.added_users_model.splice(idx, 1);

      this.addedUsersModelChange.emit(this.added_users_model);
    }
  }


  toggleExpanded(key: string) {
    var e = this.info.expanded[key];
    if(e) {
      this.info.expanded[key] = false;
    } else {
      this.info.expanded[key] = true;
    }
  }

  returnSelectedModel(key: string) {
    if(!this.info.selected[key]) {
      this.info.selected[key] = true;
    }
    return this.info.selected[key];
  }
}
