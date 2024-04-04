import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) {
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
    console.log(this.registrationForm.value);

    this.authService.onRegistration(this.registrationForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      },
    });
  }
}
