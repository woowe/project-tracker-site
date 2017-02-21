import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pt-user-info',
  templateUrl: './pt-user-info.component.html',
  styleUrls: ['./pt-user-info.component.scss']
})
export class PtUserInfoComponent implements OnInit {
  @Output() userModelChange = new EventEmitter();

  user_model: any = {};

  user_form: FormGroup;

  submit = false;

  constructor(private fb: FormBuilder) {
    this.buildForm();
  }

  buildForm(): void {
    this.user_form = this.fb.group({
      'name': [this.user_model.name, Validators.required],
      'email': [this.user_model.email],
      'phone': [this.user_model.phone],
      'title': [this.user_model.title],
      'primary_contact': [this.user_model.primary_contact]
    });

    this.user_form.valueChanges
      .subscribe( data => this.onValueChanged(data));

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

  onSubmit() {
    this.submit = true;
  }

  ngOnInit() {
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
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.'
    }
  };

}
