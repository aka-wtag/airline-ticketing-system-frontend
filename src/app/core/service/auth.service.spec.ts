import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { environment } from '../../../environments/environment';
import { User } from '../interface/user';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let mockJwtService: jasmine.SpyObj<JwtService>;

    const mockUser: User = { id: 1, role: 'User' };

    beforeEach(() => {
        mockJwtService = jasmine.createSpyObj('JwtService', ['getToken', 'getUserFromToken', 'setToken', 'removeToken']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: JwtService, useValue: mockJwtService }
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('onLogin', () => {
        it('should login and set authenticated user', () => {
            const mockResponse = { accessToken: 'fake-token' };

            mockJwtService.getUserFromToken.and.returnValue(mockUser);

            service.onLogin({ email: 'abc@gmail.com', password: '123' }).subscribe(response => {
                expect(response).toEqual(mockResponse);
                expect(service.authenticatedUser.getValue()).toEqual(mockUser);
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/users/login`);
            expect(req.request.method).toBe('POST');
            req.flush(mockResponse);

            expect(mockJwtService.setToken).toHaveBeenCalledWith('fake-token');
        });

        it('should handle login error', () => {
            service.onLogin({ email: 'test@test.com', password: 'password' }).subscribe(
                () => fail('should have failed with the 500 error'),
                (error: string) => {
                    expect(error).toBe('Service not available');
                }
            );

            const req = httpMock.expectOne(`${environment.apiUrl}/users/login`);
            expect(req.request.method).toBe('POST');
            req.flush('error', { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('onLogout', () => {
        it('should logout user', () => {
            service.onLogout().subscribe(response => {
                expect(response).toBeNull();
                expect(service.authenticatedUser.getValue()).toBeNull();
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/users/logout`);
            expect(req.request.method).toBe('POST');
            req.flush(null);
        });
    });

    describe('onRegistration', () => {
        it('should register a user successfully', () => {
            const mockResponse = { message: 'User registered successfully' };

            service.onRegistration({ name: 'abc', email: 'abc@gmail.com', password: '123' }).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/passengers`);
            expect(req.request.method).toBe('POST');
            req.flush(mockResponse);
        });

        it('should handle registration error', () => {
            service.onRegistration({ name: 'abc', email: 'abc@gmail.com', password: '123' }).subscribe(
                () => fail('should have failed with the 400 error'),
                (error: string) => {
                    expect(error).toBe('Bad Request');
                }
            );

            const req = httpMock.expectOne(`${environment.apiUrl}/passengers`);
            expect(req.request.method).toBe('POST');
            req.flush({ message: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('updateAuthenticatedUser', () => {
        it('should update the authenticated user', () => {
            service.updateAuthenticatedUser(mockUser);
            expect(service.authenticatedUser.getValue()).toEqual(mockUser);
        });
    });

    describe('setAuthenticatedUser', () => {
        it('should set the authenticated user from token', () => {
            const mockResponse = { accessToken: 'fake-token' };

            mockJwtService.getUserFromToken.and.returnValue(mockUser);

            service.setAuthenticatedUser(mockResponse);

            expect(service.authenticatedUser.getValue()).toEqual(mockUser);
            expect(mockJwtService.setToken).toHaveBeenCalledWith('fake-token');
        });
    });

    describe('removeAuthenticatedUser', () => {
        it('should remove the authenticated user', () => {
            service.updateAuthenticatedUser(mockUser);
            expect(service.authenticatedUser.getValue()).toEqual(mockUser);

            service.removeAuthenticatedUser();
            expect(service.authenticatedUser.getValue()).toBeNull();
            expect(mockJwtService.removeToken).toHaveBeenCalled();
        });
    });

    describe('getUserId', () => {
        it('should return the user id', () => {
            service.updateAuthenticatedUser(mockUser);
            expect(service.getUserId()).toBe(1);
        });

        it('should return undefined if no user is authenticated', () => {
            service.updateAuthenticatedUser(null);
            expect(service.getUserId()).toBeUndefined();
        });
    });

    describe('getUserType', () => {
        it('should return the user type', () => {
            service.updateAuthenticatedUser(mockUser);
            expect(service.getUserType()).toBe('User');
        });

        it('should return undefined if no user is authenticated', () => {
            service.updateAuthenticatedUser(null);
            expect(service.getUserType()).toBeUndefined();
        });
    });

    describe('errorHandler', () => {
        it('should return "Service not available" for 500 error', () => {
            const errorResponse = new HttpErrorResponse({
                error: 'error',
                status: 500,
                statusText: 'Internal Server Error'
            });

            service['errorHandler'](errorResponse).subscribe(
                () => fail('should have failed with the 500 error'),
                (error: string) => {
                    expect(error).toBe('Service not available');
                }
            );
        });

        it('should return "Request not correct" for 400 error without message', () => {
            const errorResponse = new HttpErrorResponse({
                error: 'error',
                status: 400,
                statusText: 'Bad Request'
            });

            service['errorHandler'](errorResponse).subscribe(
                () => fail('should have failed with the 400 error'),
                (error: string) => {
                    expect(error).toBe('Request not correct');
                }
            );
        });

        it('should return the error message for 400 error with message', () => {
            const errorResponse = new HttpErrorResponse({
                error: { message: 'Bad Request' },
                status: 400,
                statusText: 'Bad Request'
            });

            service['errorHandler'](errorResponse).subscribe(
                () => fail('should have failed with the 400 error'),
                (error: string) => {
                    expect(error).toBe('Bad Request');
                }
            );
        });
    });
});
