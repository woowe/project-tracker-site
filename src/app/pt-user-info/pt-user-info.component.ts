import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { ProjectManagerService } from '../services/ProjectManager/project-manager.service';

import { emailValidator, phoneValidator, userExistsValidatorFactory } from '../validators/pt-validators';

@Component({
  selector: 'pt-user-info',
  templateUrl: './pt-user-info.component.html',
  styleUrls: ['./pt-user-info.component.scss']
})
export class PtUserInfoComponent {
  @Output() userModelChange = new EventEmitter();

  user_model: any = {};

  user_form: FormGroup;

  submit_val = false;

  constructor(private fb: FormBuilder, private pm: ProjectManagerService) {
    this.buildForm();
  }

  buildForm(): void {
    this.user_form = this.fb.group({
      'name': [this.user_model.name, Validators.required],
      'email': [this.user_model.email, Validators.compose([Validators.required, emailValidator]), userExistsValidatorFactory(this.pm)],
      'phone': [this.user_model.phone, Validators.compose([Validators.required, phoneValidator])],
      'title': [this.user_model.title],
      'primary_contact': [this.user_model.primary_contact]
    });

    this.user_form.valueChanges
      .subscribe( data => this.onValueChanged(data));

    this.user_form.get('email').statusChanges
      .subscribe( data => this.onValueChanged(data) );

    this.onValueChanged();
  }

  onValueChanged(data?: any): void {
    if (!this.user_form) { return; }
    const form = this.user_form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  cleanData(user_form_data: any) {
    if(user_form_data.title === null) {
      user_form_data.title = "";
    }

    if(user_form_data.primary_contact === null) {
      user_form_data.primary_contact = false;
    }

    user_form_data.phone = user_form_data.phone.replace(/#|ext|extension/gi, 'x');
    user_form_data.phone = user_form_data.phone.replace(/[^x\d]*/gi, '');
    return user_form_data;
  }

  onSubmit() {
    this.submit_val = true;

    this.user_model = this.cleanData(this.user_form.value);
    this.userModelChange.emit(this.user_model);
  }

  @Input()
  get userModel() {
    return this.user_model;
  }

  set userModel(user: any) {
    this.user_model = user;

    this.userModelChange.emit(this.user_model);
  }

  formErrors = {
    'name': '',
    'phone': '',
    'email': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'phone': {
      'valid_phone': 'The phone number is not valid',
      'required': 'Phone is required.'
    },
    'email': {
      'valid_email': 'The email address is not valid',
      'user_exsits': 'The email address is already in use',
      'required': 'Email is required.'
    }
  };

}
