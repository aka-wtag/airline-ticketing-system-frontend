import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AddFlightComponent } from './add-flight.component';
import { AirlineService } from 'src/app/core/service/airline.service';
import { FlightService } from 'src/app/core/service/flight.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { FlightCreateRequest } from 'src/app/core/interface/flight-create-request';

class MockAirlineService {
  getAllAirlines() {
    return of({
      content: [
        {
          airlineId: 1,
          airlineModel: 'BI-101',
          airlineName: 'Airline 1',
          numberOfSeats: 200,
        },
      ],
    });
  }
}

class MockFlightService {
  createFlight(flight: FlightCreateRequest) {
    return of({});
  }
}

class MockToastService {
  show(message: string, success: boolean) {}
}

describe('AddFlightComponent', () => {
  let component: AddFlightComponent;
  let fixture: ComponentFixture<AddFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFlightComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AirlineService, useClass: MockAirlineService },
        { provide: FlightService, useClass: MockFlightService },
        { provide: ToastService, useClass: MockToastService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize airlines, sources, and destinations on init', () => {
    expect(component.airlines).toEqual([
      {
        airlineId: 1,
        airlineModel: 'BI-101',
        airlineName: 'Airline 1',
        numberOfSeats: 200,
      },
    ]);
    expect(component.sources).toEqual([
      'Dhaka',
      'Chittagong',
      'Sylhet',
      'Florida',
      'Toronto',
    ]);
    expect(component.destinations).toEqual([
      'Dhaka',
      'Chittagong',
      'Sylhet',
      'Florida',
      'Toronto',
    ]);
  });

  it('should validate the form correctly', () => {
    const form = component.flightForm;
    expect(form.valid).toBeFalsy();

    form.controls['departureDate'].setValue('2024-06-26');
    form.controls['departureTime'].setValue('10:00');
    form.controls['arrivalDate'].setValue('2024-06-26');
    form.controls['arrivalTime'].setValue('12:00');
    form.controls['departureLocation'].setValue('Dhaka');
    form.controls['arrivalLocation'].setValue('Chittagong');
    form.controls['fare'].setValue(1200);
    form.controls['airlineId'].setValue(1);

    expect(form.valid).toBeTruthy();
  });

  it('should display error messages when fields are touched and invalid', () => {
    const form = component.flightForm;
    form.controls['departureDate'].markAsTouched();
    form.controls['departureTime'].markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-message').textContent).toContain(
      'Departure Date or Time must be provided'
    );
  });

  it('should call flightService.createFlight on form submit', () => {
    const flightService = TestBed.inject(FlightService);
    const toastService = TestBed.inject(ToastService);
    spyOn(flightService, 'createFlight').and.callThrough();
    spyOn(toastService, 'show');

    const form = component.flightForm;
    form.controls['departureDate'].setValue('2024-06-26');
    form.controls['departureTime'].setValue('10:00');
    form.controls['arrivalDate'].setValue('2024-06-26');
    form.controls['arrivalTime'].setValue('12:00');
    form.controls['departureLocation'].setValue('Dhaka');
    form.controls['arrivalLocation'].setValue('Chittagong');
    form.controls['fare'].setValue(1200);
    form.controls['airlineId'].setValue(1);

    component.onSubmit();

    const expectedFlight: FlightCreateRequest = {
      departureDate: '2024-06-26',
      departureTime: '10:00',
      arrivalDate: '2024-06-26',
      arrivalTime: '12:00',
      departureLocation: 'Dhaka',
      arrivalLocation: 'Chittagong',
      fare: 1200,
      airlineId: 1,
    };

    expect(flightService.createFlight).toHaveBeenCalledWith(expectedFlight);
    expect(toastService.show).toHaveBeenCalledWith('Flight added', true);
  });

  it('should handle error on flightService.createFlight failure', () => {
    const flightService = TestBed.inject(FlightService);
    const toastService = TestBed.inject(ToastService);
    spyOn(flightService, 'createFlight').and.returnValue(throwError('Error'));
    spyOn(toastService, 'show');

    const form = component.flightForm;
    form.controls['departureDate'].setValue('2024-06-26');
    form.controls['departureTime'].setValue('10:00');
    form.controls['arrivalDate'].setValue('2024-06-26');
    form.controls['arrivalTime'].setValue('12:00');
    form.controls['departureLocation'].setValue('Dhaka');
    form.controls['arrivalLocation'].setValue('Chittagong');
    form.controls['fare'].setValue(1200);
    form.controls['airlineId'].setValue(1);

    component.onSubmit();

    const expectedFlight: FlightCreateRequest = {
      departureDate: '2024-06-26',
      departureTime: '10:00',
      arrivalDate: '2024-06-26',
      arrivalTime: '12:00',
      departureLocation: 'Dhaka',
      arrivalLocation: 'Chittagong',
      fare: 1200,
      airlineId: 1,
    };

    expect(flightService.createFlight).toHaveBeenCalledWith(expectedFlight);
    expect(toastService.show).toHaveBeenCalledWith('Error', false);
  });
});
