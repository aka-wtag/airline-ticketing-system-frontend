import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { BookingService } from 'src/app/core/service/booking.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { ManageBookingsComponent } from './manage-bookings.component';
import { Booking } from 'src/app/core/interface/booking';
import { Flight } from 'src/app/core/interface/flight';
import { Airline } from 'src/app/core/interface/airline';
import { NgxPaginationModule } from 'ngx-pagination';

describe('ManageBookingsComponent', () => {
  let component: ManageBookingsComponent;
  let fixture: ComponentFixture<ManageBookingsComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockAirline: Airline = {
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

  const mockBookings: Booking[] = [
    {
      bookingNumber: 1,
      bookingDate: '2023-06-01',
      bookedSeats: 2,
      bookingAmount: 500,
      passenger: {
        userId: 1,
        userEmail: 'user1@gmail.com',
        userFullName: 'user1',
        userContact: '0173333333',
        passengerPassport: 'ASD465',
      },
      flight: mockFlight,
    },
  ];

  beforeEach(async () => {
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', [
      'getBookings',
      'deleteBooking',
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [ManageBookingsComponent],
      imports: [HttpClientTestingModule, NgxPaginationModule],
      providers: [
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageBookingsComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(
      BookingService
    ) as jasmine.SpyObj<BookingService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bookings on init', () => {
    const mockResponse = {
      content: mockBookings,
      totalElements: 1,
    };
    bookingService.getBookings.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(bookingService.getBookings).toHaveBeenCalledWith(0, 3);
    expect(component.bookings).toEqual(mockResponse.content);
    expect(component.totalItems).toBe(mockResponse.totalElements);
  });

  it('should handle pagination', () => {
    spyOn(component, 'loadBookings');
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.loadBookings).toHaveBeenCalled();
  });

  it('should show flight details', () => {
    component.showFlightDetails(mockFlight);
    expect(component.showFlight).toBeTrue();
    expect(component.selectedFlight).toEqual(mockFlight);
  });

  it('should hide flight details', () => {
    component.hideFlightDetails();
    expect(component.showFlight).toBeFalse();
  });

  it('should delete booking and reload bookings', () => {
    bookingService.deleteBooking.and.returnValue(of(undefined));
    spyOn(component, 'loadBookings');

    const mockBooking = mockBookings[0];

    component.deleteBooking(
      mockBooking.passenger.userId,
      mockBooking.bookingNumber
    );

    expect(bookingService.deleteBooking).toHaveBeenCalledWith(
      mockBooking.passenger.userId,
      mockBooking.bookingNumber
    );
    expect(component.loadBookings).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith('Booking deleted', true);
  });

  it('should handle delete booking error', () => {
    const mockBooking = mockBookings[0];
    bookingService.deleteBooking.and.returnValue(throwError('Error'));

    component.deleteBooking(
      mockBooking.passenger.userId,
      mockBooking.bookingNumber
    );

    expect(bookingService.deleteBooking).toHaveBeenCalledWith(
      mockBooking.passenger.userId,
      mockBooking.bookingNumber
    );
    expect(toastService.show).toHaveBeenCalledWith('Error', false);
  });

  it('should open confirmation modal', () => {
    const mockBooking = mockBookings[0];
    component.openConfirmationModal(mockBooking);
    expect(component.selectedBooking).toEqual(mockBooking);
    expect(component.isConfirmationModalOpen).toBeTrue();
  });

  it('should close confirmation modal and delete booking if confirmed', () => {
    const mockBooking = mockBookings[0];
    spyOn(component, 'deleteBooking');
    component.selectedBooking = mockBooking;

    component.closeConfirmationModal(true);

    expect(component.isConfirmationModalOpen).toBeFalse();
    expect(component.deleteBooking).toHaveBeenCalledWith(
      mockBooking.passenger.userId,
      mockBooking.bookingNumber
    );
  });

  it('should close confirmation modal without deleting booking if not confirmed', () => {
    spyOn(component, 'deleteBooking');

    component.closeConfirmationModal(false);

    expect(component.isConfirmationModalOpen).toBeFalse();
    expect(component.deleteBooking).not.toHaveBeenCalled();
  });
});
