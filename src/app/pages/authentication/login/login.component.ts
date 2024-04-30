import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {}

  onSubmit() {
    this.authService.onLogin(this.loginForm.value).subscribe({
      next: () => {
        if (this.authService.getUserType() === 'Admin') {
          this.router.navigate(['/dashboard']);
          return;
        }
        this.router.navigate(['/passenger']);
      },
      error: (err) => {
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
