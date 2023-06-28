import { AbstractControl, ValidatorFn } from '@angular/forms';

export function validateTestingNumbers(field: string, validatorField: { [key: string]: boolean }): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const value = control.get(field).value;
    if (value != null) {
      let validate = true;
      const c = value.split(',');
      if (c.length === 0) {
        if (!checkContactNumber(c)) {
          validate = false;
        }
      } else {
        for (const cv of c) {
          if (!checkContactNumber(cv)) {
            validate = false;
            break;
          }
        }
      }
      if (!validate) {
        control.get(field).markAsTouched({ onlySelf: true });
        control.get(field).markAsDirty({ onlySelf: true });
        control.get(field).setErrors({ 'incorrect': true });
        return validatorField;
      }
    }
    return null;
  };
}
function checkContactNumber(c: string) {
  return c.match('^((\\+91-?)|0)?[0-9]{10}$');
}
