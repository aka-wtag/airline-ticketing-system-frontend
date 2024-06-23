import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Passenger } from 'src/app/core/interface/passenger';
import { AuthService } from 'src/app/core/service/auth.service';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userForm: FormGroup;
  user: any;
  newPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private passengerService: PassengerService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.userForm = new FormGroup({
      userFullName: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl(''),
      confirmPassword: new FormControl(''),
      userContact: new FormControl('', [Validators.required]),
      passengerPassport: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.passengerService.getPassengerDetails(this.authService.getUserId()!).subscribe({
      next: (passengerData: Passenger) => {
        this.userForm.reset();
        this.userForm.patchValue(passengerData);
      },
      error: (err: string) => {
        this.toastService.show(err, false);
      }
    }
    );
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('userPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  toggleNewPasswordVisibility(): void {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedDetails = this.userForm.value;
      delete updatedDetails.confirmPassword;
      if (!updatedDetails.userPassword) {
        delete updatedDetails.newPassword;
      }
      this.passengerService.updatePassengerDetails(updatedDetails, this.authService.getUserId()!).subscribe({
        next: (): void => {
          this.toastService.show('Information updated', true);
          this.loadUserDetails();
        },
        error: (err: string): void => {
          this.toastService.show(err, false);
        }
      })
    }
  }
}
