import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdDialogModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { CarouselModule, AutoCompleteModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { ProductLogosService } from './services/ProductLogos/product-logos.service';
import { CustomerService } from './services/Customer/customer.service';
import { ProjectManagerService } from './services/ProjectManager/project-manager.service';
import { AuthGuardService } from './services/AuthGuards/auth-guard.service';
import { UserInfoService } from './services/UserInfo/user-info.service';

import 'hammerjs';
import { ProductSelectionComponent } from './product-selection/product-selection.component';

import { PhoneFormatPipe } from './pipes/phone_format.pipe';
import { ToPathPipe } from './pipes/to_path.pipe';
import { SafeUrlPipe } from './pipes/safe_url.pipe';
import { IsProductPipe } from './pipes/is_product.pipe';
import { MilestoneTrackerComponent } from './milestone-tracker/milestone-tracker.component';
import { ProjectManagerDashboardComponent, AddDealershipDialog } from './project-manager-dashboard/project-manager-dashboard.component';
import { MilestoneEditorComponent } from './milestone-editor/milestone-editor.component';
import { FindPeopleComponent } from './find-people/find-people.component';
import { UserSliderComponent } from './user-slider/user-slider.component';
import { PtListComponent } from './pt-list/pt-list.component';
import { PtChipListComponent } from './pt-chip-list/pt-chip-list.component';
import { PtFormContainerComponent } from './pt-form-container/pt-form-container.component';

import { environment } from '../environments/environment';
import { PtUserSearchComponent } from './pt-user-search/pt-user-search.component';
import { PtUserInfoComponent } from './pt-user-info/pt-user-info.component';
import { PtDealershipInfoComponent } from './pt-dealership-info/pt-dealership-info.component';

console.log(environment.firebaseConfig.authDomain === "project-tracker-staging.firebaseapp.com" ? 'Development Environment!' : 'Production Environment!');

const myFirebaseConfig = environment.firebaseConfig;

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'product-selection', component: ProductSelectionComponent, canActivate: [AuthGuardService] },
  { path: 'milestone-tracker', component: MilestoneTrackerComponent, canActivate: [AuthGuardService] },
  { path: 'pm-dashboard', component: ProjectManagerDashboardComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductSelectionComponent,
    PhoneFormatPipe,
    ToPathPipe,
    SafeUrlPipe,
    IsProductPipe,
    MilestoneTrackerComponent,
    ProjectManagerDashboardComponent,
    AddDealershipDialog,
    MilestoneEditorComponent,
    FindPeopleComponent,
    UserSliderComponent,
    PtListComponent,
    PtChipListComponent,
    PtFormContainerComponent,
    PtUserSearchComponent,
    PtUserInfoComponent,
    PtDealershipInfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    MaterialModule,
    MdDialogModule,
    AngularFireModule.initializeApp(myFirebaseConfig, myFirebaseAuthConfig),
    CarouselModule,
    AutoCompleteModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    AddDealershipDialog
  ],
  providers: [
    ProductLogosService,
    UserInfoService,
    AuthGuardService,
    CustomerService,
    ProjectManagerService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
