import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBookingComponent } from './create-booking.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription, of, throwError } from 'rxjs';
import { BookingService } from 'src/app/core/service/booking.service';
import { FlightService } from 'src/app/core/service/flight.service';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Booking } from 'src/app/core/interface/booking';
import { Flight } from 'src/app/core/interface/flight';
import { Passenger } from 'src/app/core/interface/passenger';

describe('CreateBookingComponent', () => {
  let component: CreateBookingComponent;
  let fixture: ComponentFixture<CreateBookingComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;
  let flightService: jasmine.SpyObj<FlightService>;
  let passengerService: jasmine.SpyObj<PassengerService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockAirline = {
    airlineId: 1,
    airlineModel: 'model1',
    airlineName: 'name1',
    numberOfSeats: 200,
  };

  const mockFlight: Flight = {
    arrivalDate: '2023-06-15',
    arrivalLocation: 'y',
    arrivalTime: '13:00',
    departureDate: '2023-06-15',
    departureLocation: 'x',
    departureTime: '10:00',
    fare: 250,
    flightId: 1,
    remainingSeats: 50,
    airline: mockAirline,
  };

  const mockPassenger: Passenger = {
    userId: 1,
    userEmail: 'user1@gmail.com',
    userFullName: 'user1',
    userContact: '0173333333',
    passengerPassport: 'ASD465',
  };

  const mockBookings: Booking[] = [
    {
      bookingNumber: 1,
      bookingDate: '2023-06-01',
      bookedSeats: 2,
      bookingAmount: 500,
      passenger: mockPassenger,
      flight: mockFlight,
    },
  ];

  beforeEach(async () => {
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', [
      'createBooking',
    ]);
    const flightServiceSpy = jasmine.createSpyObj('FlightService', [
      'getAllFlights',
    ]);
    const passengerServiceSpy = jasmine.createSpyObj('PassengerService', [
      'getAllPassengers',
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [CreateBookingComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: FlightService, useValue: flightServiceSpy },
        { provide: PassengerService, useValue: passengerServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    bookingService = TestBed.inject(
      BookingService
    ) as jasmine.SpyObj<BookingService>;
    flightService = TestBed.inject(
      FlightService
    ) as jasmine.SpyObj<FlightService>;
    passengerService = TestBed.inject(
      PassengerService
    ) as jasmine.SpyObj<PassengerService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBookingComponent);
    component = fixture.componentInstance;

    const passengers = [mockPassenger];
    passengerService.getAllPassengers.and.returnValue(
      of({ content: passengers })
    );
    const flights = [mockFlight];
    flightService.getAllFlights.and.returnValue(of({ content: flights }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.bookingForm).toBeDefined();
    expect(component.bookingForm.get('passengerId')).toBeTruthy();
    expect(component.bookingForm.get('flightId')).toBeTruthy();
    expect(component.bookingForm.get('bookedSeats')).toBeTruthy();
  });

  it('should load passengers on init', () => {
    const passengers = [mockPassenger];

    component.ngOnInit();

    expect(passengerService.getAllPassengers).toHaveBeenCalled();
    expect(component.passengers).toEqual(passengers);
  });

  it('should handle error while loading passengers', () => {
    const error = 'Error';
    passengerService.getAllPassengers.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(toastService.show).toHaveBeenCalledWith(error, false);
  });

  it('should load flights on init', () => {
    const flights = [mockFlight];

    component.ngOnInit();

    expect(flightService.getAllFlights).toHaveBeenCalled();
    expect(component.flights).toEqual(flights);
  });

  it('should handle error while loading flights', () => {
    const error = 'Error';
    flightService.getAllFlights.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(toastService.show).toHaveBeenCalledWith(error, false);
  });

  it('should emit closeForm event on form close', () => {
    spyOn(component.closeForm, 'emit');

    component.onCloseForm();

    expect(component.closeForm.emit).toHaveBeenCalledWith(false);
  });

  it('should emit bookingSuccess event on successful form submission', () => {
    spyOn(component.bookingSuccess, 'emit');
    bookingService.createBooking.and.returnValue(of(mockBookings[0]));
    component.bookingForm.setValue({
      passengerId: 1,
      flightId: 1,
      bookedSeats: 1,
    });

    component.onFormSubmitted();

    expect(bookingService.createBooking).toHaveBeenCalledWith(1, {
      flightId: 1,
      bookedSeats: 1,
    });
    expect(toastService.show).toHaveBeenCalledWith('Booking added', true);
    expect(component.bookingSuccess.emit).toHaveBeenCalled();
  });

  it('should handle error on form submission', () => {
    const error = 'Error';
    bookingService.createBooking.and.returnValue(throwError(() => error));
    component.bookingForm.setValue({
      passengerId: 1,
      flightId: 1,
      bookedSeats: 1,
    });

    component.onFormSubmitted();

    expect(toastService.show).toHaveBeenCalledWith(error, false);
  });

  it('should disable submit button if form is invalid', () => {
    component.bookingForm.setValue({
      passengerId: null,
      flightId: null,
      bookedSeats: null,
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTruthy();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const sub1 = new Subscription();
    const sub2 = new Subscription();

    component.passengerSubscription = sub1;
    component.flightSubscription = sub2;

    spyOn(sub1, 'unsubscribe');
    spyOn(sub2, 'unsubscribe');

    component.ngOnDestroy();

    expect(sub1.unsubscribe).toHaveBeenCalled();
    expect(sub2.unsubscribe).toHaveBeenCalled();
  });
});
