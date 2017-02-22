import { Injectable } from '@angular/core';

// import * as Firebase from 'firebase';
import { AngularFire, AuthProviders, AuthMethods, AngularFireAuth, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import * as firebase from "firebase";
import { Router } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

import { generateUID } from '../../utils/utils';


@Injectable()
export class ProjectManagerService {
  _info: any;

  _dealerships: Observable<any>;
  _users: any;

  _uid: string;

  _num_dealers: number = 0;

  firebaseAuth: AngularFireAuth;
  // firebase: Firebase;

  constructor(private af: AngularFire) {
    this.firebaseAuth = af.auth;
    // this.firebase = new Firebase('https://project-tracker-c98a9.firebaseio.com/');
    this._dealerships = Observable.empty();
    this._users = this.af.database.list('/Users/');
  }

  getProjectManagerInfo(auth): Observable<any> {
    return Observable.from(this.af.database.object(`/Users/${auth.uid}`))
      .filter(info => info.group == "project manager")
      .do(info => {
        console.log("PM UPDATE: ", info);
        this._info = info;
        this._uid = auth.uid;
      })
      .switchMap(info => {
        // make array in the [key, value] pairs
        let keys = [];
        for(let k in info.dealerships)
          if(info.dealerships[k]) keys.push([k, info.dealerships[k]]);

        this._num_dealers = keys.length;

        console.log('doing stuff', keys);

        return Observable.from(keys)
          .mergeMap(([key, dealership_uid]) => this.af.database.object(`/Dealerships/${dealership_uid}`)
            , ([key, dealership_uid], dealership) => ({key, dealership}))
          // .filter(({key, dealership}) => (dealership.users && dealership.products))
          // .do(({key, dealership}) => console.log(dealership))
          .mergeMap(({key, dealership}) =>
            Observable.combineLatest(
              Observable.pairs(dealership.users || {'*': '*'})
                .map( ([key, val]) => Observable.from(this.af.database.object(`/Users/${(val as any).uid}`))
                  .map(user => ({role: (val as any).role, user}))
                ).combineAll()
                .map(arr => (arr as any[]).filter(({role, user}) => user.$key !== undefined && user.$value !== null)),
              Observable.pairs(dealership.products || {'*': '*'})
                .map( ([key, val]) => Observable.from(this.af.database.object(`/Product Building/${val}`))
                  .map(product => ({product}))
                ).combineAll()
                .map(arr => (arr as any[]).filter(({product}) => product.$key !== undefined && product.$value !== null)),
              (users, products) => ({key, dealership, users, products})
            )
          )
      });
  }

  get info(): any {
    return this._info;
  }

  get dealerships(): Observable<any> {
    return this._dealerships;
  }

  getAllProductTemplates() {
    return this.af.database.object('/Product Templates/');
  }
  getAllMilestoneTemplates() {
    return this.af.database.object('/Milestone Templates/');
  }
  getAllUsers() {
    return this.af.database.list('/Users/');
  }

  getUser(email: string): Observable<any> {
    return Observable.from( this.af.database.list('/Users', {
      query: {
        orderByChild: 'email',
        equalTo: email,
      }
    }) ).first();
  }

  createCustomer(user_obj: any) {
    var password = generateUID()();
    return this.firebaseAuth.createUser({
      email: user_obj.email,
      password
    })
    .then( r => {
      if(r) {
        firebase.auth().sendPasswordResetEmail(user_obj.email);
        return this.addUser(user_obj, r.uid)
          .then( () => r );
      }
    });
  }

  addDealership(dealership_obj) {
    return this.af.database.list('/Dealerships/').push(dealership_obj);
  }

  addDealershipToPm(dealership_uid) {
    return this.af.database.list(`/Users/${this._uid}/dealerships`).push(dealership_uid);
  }

  addDealershipToUser(user_uid, dealership_uid) {
    return this.af.database.list(`/Users/${user_uid}/dealerships`).push(dealership_uid);
  }

  addUserToDealership(primary_contact, user_uid, dealership_uid) {
    this.af.database.list(`/Dealerships/${dealership_uid}/users/`).push({
      'role': primary_contact ? 'primary' : 'secondary',
      'uid': user_uid
    });
  }

  updatePmInfo(updated_info: any) {
    return this.af.database.object(`/Users/${this._uid}`).update(updated_info);
  }

  updateUserInfo(user_uid: string, updated_info: any) {
    return this.af.database.object(`/Users/${user_uid}`).update(updated_info);
  }

  addUser(user_obj: any, user_uid: string) {
    let user = Object.assign(user_obj, { group: 'customer' });

    return this.af.database.object(`/Users/${user_uid}`).update(user_obj);
  }

  addMilestoneBuilding(milestone_obj: any) {
    return this.af.database.list('/Milestone Building/').push({
      milestones: milestone_obj.milestones,
      name: milestone_obj.name
    });
  }

  addProductBuilding(product_obj: any, dealership_uid: string) {
    this.af.database.list('/Product Building/').push({
      activation: product_obj.activation,
      name: product_obj.name,
      product_type: product_obj.product_type,
      started: product_obj.started,
      template: product_obj.template
    }).then(ref => {
      this.af.database.list(`/Dealerships/${dealership_uid}/products/`).push(ref.path.o[1]);
    });
  }

  ngOnDestroy() {
  }
}
