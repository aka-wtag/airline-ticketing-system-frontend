import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../core/service/auth.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let router: Router;
    let toastService: jasmine.SpyObj<ToastService>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['onLogin', 'getUserType']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [ReactiveFormsModule, RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy }
            ]
        })
            .compileComponents();

        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
        router = TestBed.inject(Router);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the login form with empty values', () => {
        expect(component.loginForm.value).toEqual({ email: '', password: '' });
    });

    it('should mark email as invalid if empty', () => {
        const emailControl = component.loginForm.get('email');
        emailControl?.setValue('');
        emailControl?.markAsTouched();

        expect(component.isValid('email', 'required')).toBe(true);
    });

    it('should mark email as invalid if not in correct format', () => {
        const emailControl = component.loginForm.get('email');
        emailControl?.setValue('invalid-email');
        emailControl?.markAsTouched();

        expect(component.isValid('email', 'pattern')).toBe(true);
    });

    it('should mark password as invalid if empty', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('');
        passwordControl?.markAsTouched();

        expect(component.isValid('password', 'required')).toBe(true);
    });

    it('should call authService.onLogin and navigate to dashboard for admin', fakeAsync(() => {
        const loginData = { email: 'admin@example.com', password: 'admin123' };
        authService.onLogin.and.returnValue(of({ accessToken: 'admin-token' }));
        authService.getUserType.and.returnValue('Admin');

        spyOn(router, 'navigate').and.stub();

        component.loginForm.setValue(loginData);
        component.onSubmit();
        tick();

        expect(authService.onLogin).toHaveBeenCalledWith(loginData);
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should call authService.onLogin and navigate to passenger page for non-admin', fakeAsync(() => {
        const loginData = { email: 'user@gmail.com', password: 'user123' };
        authService.onLogin.and.returnValue(of({ accessToken: 'user-token' }));
        authService.getUserType.and.returnValue('User');

        spyOn(router, 'navigate').and.stub();

        component.loginForm.setValue(loginData);
        component.onSubmit();
        tick();

        expect(authService.onLogin).toHaveBeenCalledWith(loginData);
        expect(router.navigate).toHaveBeenCalledWith(['/passenger']);
    }));

    it('should call toastService.show on login error', fakeAsync(() => {
        const loginData = { email: 'user@gmail.com', password: 'wrongpass' };
        const errorMessage = 'Invalid credentials';
        authService.onLogin.and.returnValue(throwError(errorMessage));

        component.loginForm.setValue(loginData);
        component.onSubmit();
        tick();

        expect(authService.onLogin).toHaveBeenCalledWith(loginData);
        expect(toastService.show).toHaveBeenCalledWith(errorMessage, false);
    }));
});
