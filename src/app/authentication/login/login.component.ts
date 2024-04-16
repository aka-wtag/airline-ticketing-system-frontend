import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtService: JwtService,
    private toastService: ToastService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  goToRegistration() {
    this.router.navigate(['/registration']);
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.authService.onLogin(this.loginForm.value).subscribe({
      next: (data) => {
        console.log(data);
        if (
          this.jwtService.getUserTypeFromToken(
            localStorage.getItem('token')
          ) === 'Admin'
        ) {
          this.router.navigate(['']);
          return;
        }
        this.router.navigate(['/passenger-page']);
      },
      error: (err) => {
        this.toastService.show(err.error.message, false);
      },
    });
  }
}
