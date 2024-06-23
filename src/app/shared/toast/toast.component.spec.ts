import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
    let component: ToastComponent;
    let fixture: ComponentFixture<ToastComponent>;
    let element: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ToastComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ToastComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display success message with success class', () => {
        component.message = 'Success...';
        component.success = true;
        fixture.detectChanges();

        const messageElement = element.querySelector('.message');
        const iconElement = element.querySelector('.icon');

        expect(messageElement?.textContent).toContain('Success...');
        expect(messageElement?.classList.contains('success')).toBe(true);
        expect(messageElement?.classList.contains('error')).toBe(false);
        expect(iconElement?.classList.contains('fa-solid')).toBe(true);
        expect(iconElement?.classList.contains('fa-check')).toBe(true);
    });

    it('should display error message with error class', () => {
        component.message = 'Failed..';
        component.success = false;
        fixture.detectChanges();

        const messageElement = element.querySelector('.message');
        const iconElement = element.querySelector('.icon');

        expect(messageElement?.textContent).toContain('Failed..');
        expect(messageElement?.classList.contains('success')).toBe(false);
        expect(messageElement?.classList.contains('error')).toBe(true);
        expect(iconElement?.classList.contains('fa-solid')).toBe(true);
        expect(iconElement?.classList.contains('fa-xmark')).toBe(true);
    });

    it('should display correct icon and message when success is true', () => {
        component.message = 'Success message';
        component.success = true;
        fixture.detectChanges();

        const iconElement = element.querySelector('.icon');

        expect(iconElement?.classList.contains('fa-check')).toBe(true);
        expect(iconElement?.classList.contains('fa-xmark')).toBe(false);
        expect(component.message).toBe('Success message');
    });

    it('should display correct icon and message when success is false', () => {
        component.message = 'Error message';
        component.success = false;
        fixture.detectChanges();

        const iconElement = element.querySelector('.icon');

        expect(iconElement?.classList.contains('fa-check')).toBe(false);
        expect(iconElement?.classList.contains('fa-xmark')).toBe(true);
        expect(component.message).toBe('Error message');
    });
});
