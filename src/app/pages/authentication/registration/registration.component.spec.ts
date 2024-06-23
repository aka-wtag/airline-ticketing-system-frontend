import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/core/service/auth.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('RegistrationComponent', () => {
    let component: RegistrationComponent;
    let fixture: ComponentFixture<RegistrationComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let toastService: jasmine.SpyObj<ToastService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['onRegistration']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
        const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [RegistrationComponent],
            imports: [ReactiveFormsModule, RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
                { provide: Router, useValue: routerSpyObj }
            ]
        })
            .compileComponents();

        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the registration form with empty values', () => {
        expect(component.registrationForm.value).toEqual({
            userFullName: '',
            userPassword: '',
            userEmail: '',
            userContact: '',
            passengerPassport: ''
        });
    });

    it('should mark userFullName as invalid if empty', () => {
        const fullNameControl = component.registrationForm.get('userFullName');
        fullNameControl?.setValue('');
        fullNameControl?.markAsTouched();

        expect(component.isValid('userFullName', 'required')).toBe(true);
    });

    it('should mark userFullName as invalid if too short', () => {
        const fullNameControl = component.registrationForm.get('userFullName');
        fullNameControl?.setValue('John');
        fullNameControl?.markAsTouched();

        expect(component.isValid('userFullName', 'minlength')).toBe(true);
    });

    it('should mark userEmail as invalid if empty', () => {
        const emailControl = component.registrationForm.get('userEmail');
        emailControl?.setValue('');
        emailControl?.markAsTouched();

        expect(component.isValid('userEmail', 'required')).toBe(true);
    });

    it('should mark userEmail as invalid if not in correct format', () => {
        const emailControl = component.registrationForm.get('userEmail');
        emailControl?.setValue('invalid-email');
        emailControl?.markAsTouched();

        expect(component.isValid('userEmail', 'pattern')).toBe(true);
    });

    it('should call authService.onRegistration and navigate to login on successful registration', fakeAsync(() => {
        const registrationData = {
            userFullName: 'test',
            userPassword: '123',
            userEmail: 'test@gmail.com',
            userContact: '1234567890',
            passengerPassport: 'AB1234567'
        };
        authService.onRegistration.and.returnValue(of(null as any));

        component.registrationForm.setValue(registrationData);
        component.onSubmit();
        tick();

        expect(authService.onRegistration).toHaveBeenCalledWith(registrationData);
        expect(toastService.show).toHaveBeenCalledWith('Registration successful', true);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should call toastService.show on registration error', fakeAsync(() => {
        const registrationData = {
            userFullName: 'John Doe',
            userPassword: 'password123',
            userEmail: 'john.doe@example.com',
            userContact: '1234567890',
            passengerPassport: 'AB1234567'
        };
        const errorMessage = 'Registration failed';
        authService.onRegistration.and.returnValue(throwError(errorMessage));

        component.registrationForm.setValue(registrationData);
        component.onSubmit();
        tick();

        expect(authService.onRegistration).toHaveBeenCalledWith(registrationData);
        expect(toastService.show).toHaveBeenCalledWith(errorMessage, false);
    }));
});
