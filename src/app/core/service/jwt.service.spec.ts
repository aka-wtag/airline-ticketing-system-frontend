import { TestBed } from '@angular/core/testing';
import { JwtService } from './jwt.service';
import { User } from '../interface/user';

describe('JwtService', () => {
    let service: JwtService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [JwtService]
        });
        service = TestBed.inject(JwtService);

        spyOn(console, 'error');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('decodeToken', () => {
        it('should decode a valid token', () => {
            const token = 'valid-token';
            const decodedToken = { sub: 1, userType: 'User' };

            spyOn(service, 'decodeToken').and.returnValue(decodedToken);

            const result = service.decodeToken(token);
            expect(result).toEqual(decodedToken);
        });

        it('should return null for an invalid token', () => {
            const token = 'invalid-token';

            jasmine.createSpy('jwtDecode').and.throwError('Invalid token');

            const result = service.decodeToken(token);
            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith('Error decoding token:', jasmine.any(Error));
        });
    });

    describe('getUserFromToken', () => {
        it('should return a user object from a valid token', () => {
            const token = 'valid.token.here';
            const decodedToken = { sub: 1, userType: 'User' };

            spyOn(service, 'decodeToken').and.returnValue(decodedToken);

            const user: User | null = service.getUserFromToken(token);
            expect(user).toEqual({ id: 1, role: 'User' });
        });

        it('should return null for an invalid token', () => {
            const token = 'invalid.token.here';

            spyOn(service, 'decodeToken').and.returnValue(null);

            const user: User | null = service.getUserFromToken(token);
            expect(user).toBeNull();
        });

        it('should return null if token is null', () => {
            const user: User | null = service.getUserFromToken(null);
            expect(user).toBeNull();
        });
    });

    describe('getToken', () => {
        it('should return the token from localStorage', () => {
            spyOn(localStorage, 'getItem').and.returnValue('fake-token');

            const token = service.getToken();
            expect(token).toBe('fake-token');
        });

        it('should return null if no token is found in localStorage', () => {
            spyOn(localStorage, 'getItem').and.returnValue(null);

            const token = service.getToken();
            expect(token).toBeNull();
        });
    });

    describe('setToken', () => {
        it('should set the token in localStorage', () => {
            spyOn(localStorage, 'setItem');

            service.setToken('fake-token');
            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
        });
    });

    describe('removeToken', () => {
        it('should remove the token from localStorage', () => {
            spyOn(localStorage, 'removeItem');

            service.removeToken();
            expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        });
    });
});
