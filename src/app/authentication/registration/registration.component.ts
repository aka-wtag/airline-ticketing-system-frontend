import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  message: string;
  success: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registrationForm = new FormGroup({
      userFullName: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      userPassword: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userContact: new FormControl('', [Validators.required]),
      passengerPassport: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {}

  onSubmit() {
    this.authService.onRegistration(this.registrationForm.value).subscribe({
      next: () => {
        this.toastService.show('Registration successful', true);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastService.show(err.error.message, false);
      },
    });
  }
}
