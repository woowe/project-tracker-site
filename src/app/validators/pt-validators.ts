import { AbstractControl, AsyncValidatorFn  } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProjectManagerService } from '../services/ProjectManager/project-manager.service';

export function phoneValidator(c: AbstractControl) {
  if (c.value === "") { return null; }
  var phone_re = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
  return phone_re.test(c.value) ?  null : { 'valid_phone': false };
}

export function emailValidator(c: AbstractControl) {
  if (c.value === "") { return null; }
  var email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email_re.test(c.value) ?  null : { 'valid_email': false };
}

export function userExistsValidatorFactory(pm: ProjectManagerService): AsyncValidatorFn {
  return (c: AbstractControl) => {
    return pm.getUser(c.value)
      .map( r =>  r.length === 1 ? { 'user_exsits': true} : null )
  };
}
