import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { AirlineService } from 'src/app/core/service/airline.service';
import { FlightService } from 'src/app/core/service/flight.service';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let airlineService: AirlineService;
  let flightService: FlightService;
  let passengerService: PassengerService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxPaginationModule],
      declarations: [DashboardComponent],
      providers: [
        AirlineService,
        FlightService,
        PassengerService,
        ToastService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    airlineService = TestBed.inject(AirlineService);
    flightService = TestBed.inject(FlightService);
    passengerService = TestBed.inject(PassengerService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load total airlines on init', () => {
    spyOn(airlineService, 'getAirlines').and.returnValue(
      of({ totalElements: 10 })
    );
    component.ngOnInit();
    expect(airlineService.getAirlines).toHaveBeenCalledWith(0, 1);
    expect(component.totalAirlines).toBe(10);
  });

  it('should load total passengers on init', () => {
    spyOn(passengerService, 'getPassengers').and.returnValue(
      of({ totalElements: 15 })
    );
    component.ngOnInit();
    expect(passengerService.getPassengers).toHaveBeenCalledWith(0, 1);
    expect(component.totalPassengers).toBe(15);
  });

  it('should load flights on init', () => {
    const mockFlights = { content: [], totalElements: 5 };
    spyOn(flightService, 'getFlights').and.returnValue(of(mockFlights));
    component.ngOnInit();
    expect(flightService.getFlights).toHaveBeenCalledWith(
      component.currentPage - 1,
      component.itemsPerPage
    );
    expect(component.flights).toEqual(mockFlights.content);
    expect(component.totalItems).toBe(mockFlights.totalElements);
    expect(component.totalFlights).toBe(mockFlights.totalElements);
  });

  it('should change page and load flights', () => {
    const mockFlights = { content: [], totalElements: 5 };
    spyOn(flightService, 'getFlights').and.returnValue(of(mockFlights));
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(flightService.getFlights).toHaveBeenCalledWith(
      1,
      component.itemsPerPage
    );
  });

  it('should close edit flight form', () => {
    component.closeEditFlightForm();
    expect(component.showEditFlightForm).toBeFalse();
  });

  it('should open edit flight form', () => {
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
    component.editFlightForm(mockFlight);
    expect(component.showEditFlightForm).toBeTrue();
    expect(component.selectedFlight).toEqual(mockFlight);
  });

  it('should delete flight and reload flights', () => {
    spyOn(flightService, 'deleteflight').and.returnValue(of(null as any));
    spyOn(component, 'loadFlights');
    spyOn(toastService, 'show');
    component.deleteFlight(1);
    expect(flightService.deleteflight).toHaveBeenCalledWith(1);
    expect(component.loadFlights).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith('Deleted flight', true);
  });

  it('should open confirmation modal', () => {
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
    component.openConfirmationModal(mockFlight);
    expect(component.selectedFlight).toEqual(mockFlight);
    expect(component.isConfirmationModalOpen).toBeTrue();
  });

  it('should close confirmation modal and delete flight if confirmed', () => {
    spyOn(component, 'deleteFlight');
    component.selectedFlight = {
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
    component.closeConfirmationModal(true);
    expect(component.isConfirmationModalOpen).toBeFalse();
    expect(component.deleteFlight).toHaveBeenCalledWith(1);
  });

  it('should close confirmation modal without deleting flight if not confirmed', () => {
    spyOn(component, 'deleteFlight');
    component.closeConfirmationModal(false);
    expect(component.isConfirmationModalOpen).toBeFalse();
    expect(component.deleteFlight).not.toHaveBeenCalled();
  });

  it('should handle onDeleteConfirmation correctly', () => {
    spyOn(component, 'closeConfirmationModal');
    component.onDeleteConfirmation(true);
    expect(component.closeConfirmationModal).toHaveBeenCalledWith(true);
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const getPassengersSpy = spyOn(
      passengerService,
      'getPassengers'
    ).and.returnValue(of({ subscribe: () => {} }));
    const getFlightsSpy = spyOn(flightService, 'getFlights').and.returnValue(
      of({ subscribe: () => {} })
    );
    const getAirlinesSpy = spyOn(airlineService, 'getAirlines').and.returnValue(
      of({ subscribe: () => {} })
    );

    component.ngOnInit();

    component.ngOnDestroy();

    expect(getPassengersSpy).toHaveBeenCalled();
    expect(getFlightsSpy).toHaveBeenCalled();
    expect(getAirlinesSpy).toHaveBeenCalled();
  });
});
