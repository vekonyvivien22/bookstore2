import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  subscription: Subscription;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  /* Log in user and save user id and email in localStorage. */
  login(): void {
    const { username, password } = this.loginForm.value;
    if (username && password) {
      this.subscription = this.authService.login(username, password).subscribe({
        next: (res) => {
          if (res.status == 200 && res.body.successfull) {
            const user = res.body.user as User;
            localStorage.setItem(
              'user',
              JSON.stringify({
                id: user._id,
                email: user.email,
                username: user.username,
              })
            );
            this.authService.user = user;
            this.snackBar.open(res.body.msg, 'Cancel', { duration: 3000 });
            this.router.navigateByUrl('/');
          }
        },
        error: (error) => {
          this.snackBar.open(error.error.error, 'Cancel', { duration: 3000 });
        },
      });
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
