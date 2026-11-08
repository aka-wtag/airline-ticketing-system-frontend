import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
    let service: ToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToastService]
        });
        service = TestBed.inject(ToastService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit toast message with success true', () => {
        const message = 'Success...';
        const success = true;

        let emittedToast: any = null;
        service.toastState.subscribe((toast) => {
            emittedToast = toast;
        });

        service.show(message, success);

        expect(emittedToast).toEqual({ message, success });

        setTimeout(() => {
            expect(emittedToast).toEqual('');
        }, 2000);
    });

    it('should emit toast message with success false', () => {
        const message = 'failed...';
        const success = false;

        let emittedToast: any = null;
        service.toastState.subscribe((toast) => {
            emittedToast = toast;
        });

        service.show(message, success);

        expect(emittedToast).toEqual({ message, success });

        setTimeout(() => {
            expect(emittedToast).toEqual('');
        }, 2000);
    });

    it('should clear toast message immediately', () => {
        const message = 'Testing clear';

        let emittedToast: any = null;
        service.toastState.subscribe((toast) => {
            emittedToast = toast;
        });

        service.show(message, true);
        service.clear();

        expect(emittedToast).toEqual('');
    });
});
