import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditFlightComponent } from './edit-flight.component';
import { AirlineService } from 'src/app/core/service/airline.service';
import { FlightService } from 'src/app/core/service/flight.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

describe('EditFlightComponent', () => {
  let component: EditFlightComponent;
  let fixture: ComponentFixture<EditFlightComponent>;
  let airlineService: AirlineService;
  let flightService: FlightService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [EditFlightComponent],
      providers: [AirlineService, FlightService, ToastService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFlightComponent);
    component = fixture.componentInstance;
    airlineService = TestBed.inject(AirlineService);
    flightService = TestBed.inject(FlightService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with selected flight data', () => {
    const mockFlight = {
      flightId: 1,
      fare: 1000,
      remainingSeats: 50,
      departureDate: '2023-07-01',
      departureLocation: 'Dhaka',
      departureTime: '08:00',
      arrivalDate: '2023-07-01',
      arrivalLocation: 'LA',
      arrivalTime: '11:00',
      airline: {
        airlineId: 1,
        airlineModel: 'Model 1',
        airlineName: 'Airline 1',
        numberOfSeats: 100,
      },
    };
    component.selectedFlight = mockFlight;
    component.ngOnInit();
    expect(component.editFlightForm.value).toEqual({
      fare: 2000,
      airlineId: 1,
    });
  });

  it('should load airlines on init', () => {
    const mockAirlines = {
      content: [
        {
          airlineId: 1,
          airlineModel: 'Model1',
          airlineName: 'Airline1',
          numberOfSeats: 100,
        },
      ],
    };
    spyOn(airlineService, 'getAllAirlines').and.returnValue(of(mockAirlines));
    component.loadAirlines();
    expect(airlineService.getAllAirlines).toHaveBeenCalled();
    expect(component.airlines).toEqual(mockAirlines.content);
  });

  it('should emit closeForm event on closing the form', () => {
    spyOn(component.closeForm, 'emit');
    component.onCloseForm();
    expect(component.closeForm.emit).toHaveBeenCalled();
  });

  it('should submit form and show success toast', () => {
    const mockFlight = {
      flightId: 1,
      fare: 1000,
      remainingSeats: 50,
      departureDate: '2023-07-01',
      departureLocation: 'Dhaka',
      departureTime: '08:00',
      arrivalDate: '2023-07-01',
      arrivalLocation: 'LA',
      arrivalTime: '11:00',
      airline: {
        airlineId: 1,
        airlineModel: 'Model 1',
        airlineName: 'Airline 1',
        numberOfSeats: 100,
      },
    };
    component.selectedFlight = mockFlight;
    component.ngOnInit();
    spyOn(flightService, 'updateFlight').and.returnValue(of(null as any));
    spyOn(component.updateSuccess, 'emit');
    spyOn(component.closeForm, 'emit');
    spyOn(toastService, 'show');

    component.onFormSubmitted();

    expect(flightService.updateFlight).toHaveBeenCalledWith(
      component.editFlightForm.value,
      mockFlight.flightId
    );
    expect(toastService.show).toHaveBeenCalledWith('Update successful', true);
    expect(component.updateSuccess.emit).toHaveBeenCalled();
    expect(component.closeForm.emit).toHaveBeenCalled();
  });

  it('should show error toast on form submission failure', () => {
    const mockFlight = {
      flightId: 1,
      fare: 1000,
      remainingSeats: 50,
      departureDate: '2023-07-01',
      departureLocation: 'Dhaka',
      departureTime: '08:00',
      arrivalDate: '2023-07-01',
      arrivalLocation: 'LA',
      arrivalTime: '11:00',
      airline: {
        airlineId: 1,
        airlineModel: 'Model 1',
        airlineName: 'Airline 1',
        numberOfSeats: 100,
      },
    };
    component.selectedFlight = mockFlight;
    component.ngOnInit();
    const errorMessage = 'Update failed';
    spyOn(flightService, 'updateFlight').and.returnValue(
      throwError(errorMessage)
    );
    spyOn(toastService, 'show');

    component.onFormSubmitted();

    expect(flightService.updateFlight).toHaveBeenCalledWith(
      component.editFlightForm.value,
      mockFlight.flightId
    );
    expect(toastService.show).toHaveBeenCalledWith(errorMessage, false);
  });

  it('should validate fare input correctly', () => {
    const fareControl = component.editFlightForm.get('fare');
    fareControl?.setValue('');
    expect(component.isValid('fare', 'required')).toBeTrue();

    fareControl?.setValue(500);
    expect(component.isValid('fare', 'min')).toBeTrue();

    fareControl?.setValue(1500);
    expect(component.isValid('fare', 'min')).toBeFalse();
    expect(component.isValid('fare', 'required')).toBeFalse();
  });

  it('should validate airlineId input correctly', () => {
    const airlineIdControl = component.editFlightForm.get('airlineId');
  
    airlineIdControl?.setValue('');
    expect(component.isValid('airlineId', 'required')).toBeFalse();
  
    airlineIdControl?.setValue('1');
    expect(component.isValid('airlineId', 'required')).toBeTrue();
  });
  
});
