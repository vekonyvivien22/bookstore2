import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirmationation = control.parent.get('passwordConfirmation');

  if (!password || !passwordConfirmationation) {
    return null;
  }
  if (passwordConfirmationation.value === '') {
    return null;
  }
  if (password.value === passwordConfirmationation.value) {
    return null;
  }
  return { passwordsNotMaching: true };
};
