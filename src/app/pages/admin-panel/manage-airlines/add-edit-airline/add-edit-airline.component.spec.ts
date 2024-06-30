import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AddEditAirlineComponent } from './add-edit-airline.component';
import { AirlineService } from 'src/app/core/service/airline.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { Airline } from 'src/app/core/interface/airline';
import { By } from '@angular/platform-browser';

describe('AddEditAirlineComponent', () => {
    let component: AddEditAirlineComponent;
    let fixture: ComponentFixture<AddEditAirlineComponent>;
    let airlineService: jasmine.SpyObj<AirlineService>;
    let toastService: jasmine.SpyObj<ToastService>;

    const dummyAirline: Airline = {
        airlineId: 1,
        airlineModel: 'BI-101',
        airlineName: 'Biman Bangladesh',
        numberOfSeats: 150,
    };

    beforeEach(async () => {
        const airlineServiceSpy = jasmine.createSpyObj('AirlineService', ['addAirline', 'updateAirline']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

        await TestBed.configureTestingModule({
            declarations: [AddEditAirlineComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: AirlineService, useValue: airlineServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
            ],
        }).compileComponents();

        airlineService = TestBed.inject(AirlineService) as jasmine.SpyObj<AirlineService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

        fixture = TestBed.createComponent(AddEditAirlineComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with selectedAirline values in edit mode', () => {
        component.editMode = true;
        component.selectedAirline = dummyAirline;
        fixture.detectChanges();

        expect(component.airlineForm.value).toEqual({
            airlineModel: dummyAirline.airlineModel,
            airlineName: dummyAirline.airlineName,
            numberOfSeats: dummyAirline.numberOfSeats,
        });
    });

    it('should close the form', () => {
        spyOn(component.closeForm, 'emit');
        component.onCloseForm();
        expect(component.closeForm.emit).toHaveBeenCalled();
    });

    it('should call addAirline and show success toast on form submission in add mode', () => {
        component.editMode = false;
        component.airlineForm.setValue({
            airlineModel: '',
            airlineName: 'New Biman',
            numberOfSeats: 200,
        });

        airlineService.addAirline.and.returnValue(of(dummyAirline));

        spyOn(component.success, 'emit');
        spyOn(component.closeForm, 'emit');

        component.onFormSubmitted();

        expect(airlineService.addAirline).toHaveBeenCalledWith(component.airlineForm.value);
        expect(toastService.show).toHaveBeenCalledWith('Airline added', true);
        expect(component.success.emit).toHaveBeenCalled();
        expect(component.closeForm.emit).toHaveBeenCalled();
    });

    it('should call updateAirline and show success toast on form submission in edit mode', () => {
        component.editMode = true;
        component.selectedAirline = dummyAirline;
        component.airlineForm.setValue({
            airlineModel: 'UP-101',
            airlineName: 'Updated Biman',
            numberOfSeats: 180,
        });

        airlineService.updateAirline.and.returnValue(of(dummyAirline));

        spyOn(component.success, 'emit');
        spyOn(component.closeForm, 'emit');

        component.onFormSubmitted();

        expect(airlineService.updateAirline).toHaveBeenCalledWith({
            airlineModel: 'UP-101',
            airlineName: 'Updated Biman',
            numberOfSeats: 180,
        }, dummyAirline.airlineId);
        expect(toastService.show).toHaveBeenCalledWith('Update successful', true);
        expect(component.success.emit).toHaveBeenCalled();
        expect(component.closeForm.emit).toHaveBeenCalled();
    });

    it('should show error toast on form submission failure', () => {
        component.editMode = false;
        component.airlineForm.setValue({
            airlineModel: '',
            airlineName: 'New Biman',
            numberOfSeats: 200,
        });

        airlineService.addAirline.and.returnValue(throwError('Error occurred'));

        component.onFormSubmitted();

        expect(toastService.show).toHaveBeenCalledWith('Error occurred', false);
    });

    it('should check form validity', () => {
        component.editMode = false;
        component.airlineForm.setValue({
            airlineModel: '',
            airlineName: '',
            numberOfSeats: 0,
        });

        expect(component.isFormValid()).toBe(true);

        component.airlineForm.setValue({
            airlineModel: '',
            airlineName: 'New Biman',
            numberOfSeats: 200,
        });

        expect(component.isFormValid()).toBe(false);
    });

    it('should check field validity', () => {
        component.airlineForm.controls['airlineName'].markAsTouched();
        component.airlineForm.controls['airlineName'].setErrors({ required: true });

        expect(component.isValid('airlineName', 'required')).toBe(true);
    });

    it('should display validation errors', () => {
        component.editMode = false;
        fixture.detectChanges();

        const airlineNameInput = fixture.debugElement.query(By.css('#airlineName')).nativeElement;
        airlineNameInput.value = '';
        airlineNameInput.dispatchEvent(new Event('input'));

        component.airlineForm.controls['airlineName'].markAsTouched();
        component.airlineForm.controls['airlineName'].setErrors({ required: true });

        fixture.detectChanges();

        const validationError = fixture.debugElement.query(By.css('small')).nativeElement;
        expect(validationError.textContent).toContain('*Airline name must be provided');
    });
});
