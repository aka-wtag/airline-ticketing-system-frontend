import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string;
  @ViewChild('password') passwordField!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {
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
    this.authService.onLogin(this.loginForm.value).subscribe(
      (data) => {
        this.router.navigate(['/airlines']);
      },
      (err) => {
        console.log(err.error);
        this.errorMessage = err.error.message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    );
  }
}
