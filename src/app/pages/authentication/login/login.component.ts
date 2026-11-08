import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';
import { Token } from '../../../core/interface/token';
import { USERTYPE } from 'src/app/core/constants/user-type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    this.authService.onLogin(this.loginForm.value).subscribe({
      next: (response: Token) => {
        this.authService.setAuthenticatedUser(response);

        if (this.authService.getUserType() === USERTYPE.ADMIN) {
          this.router.navigate(['/admin/dashboard']);
          return;
        }
        this.router.navigate(['/flights']);
      },
      error: (err: string) => {
        this.toastService.show(err, false);
      },
    });
  }

  isValid(key: string, validatorType: string): boolean {
    return (
      this.loginForm.get(key)?.errors?.[validatorType] &&
      this.loginForm.get(key)?.touched
    );
  }
}
