import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../auth.validator';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserRegisterData } from 'src/types';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    address: new FormControl('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
    passwordConfirmation: new FormControl('', {
      validators: [Validators.required, confirmPasswordValidator],
    }),
  });

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    const userData = this.registerForm.value as UserRegisterData;

    if (
      userData.username &&
      userData.email &&
      userData.password &&
      userData.address &&
      userData.firstName &&
      userData.lastName &&
      userData.passwordConfirmation
    ) {
      this.authService.register(userData).subscribe({
        next: (res) => {
          if (res.status == 200 && res.body.successfull) {
            this.snackBar.open(res.body.msg, 'Cancel');
            this.router.navigateByUrl('/auth/login');
          } else {
            this.snackBar.open(res.body.error, 'Cancel');
          }
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open(error.error.error, 'Cancel');
        },
      });
    }
  }
}
