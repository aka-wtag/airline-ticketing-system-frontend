import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightDetailsComponent } from './flight-details.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Flight } from 'src/app/core/interface/flight';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Component, Input } from '@angular/core';

describe('FlightDetailsComponent', () => {
  let component: FlightDetailsComponent;
  let fixture: ComponentFixture<FlightDetailsComponent>;
  let closeBtn: DebugElement;

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
    airline: {
      airlineId: 1,
      airlineModel: 'model1',
      airlineName: 'name1',
      numberOfSeats: 200,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display flight details', () => {
    component.selectedFlight = mockFlight;
    fixture.detectChanges();

    const departureLocation = fixture.debugElement.query(
      By.css('.value')
    ).nativeElement;
    const arrivalLocation = fixture.debugElement.queryAll(By.css('.value'))[1]
      .nativeElement;
    const departureDate = fixture.debugElement.queryAll(By.css('.value'))[2]
      .nativeElement;
    const arrivalDate = fixture.debugElement.queryAll(By.css('.value'))[3]
      .nativeElement;
    const fare = fixture.debugElement.queryAll(By.css('.value'))[4]
      .nativeElement;

    expect(departureLocation.textContent).toContain(
      mockFlight.departureLocation
    );
    expect(arrivalLocation.textContent).toContain(mockFlight.arrivalLocation);
    expect(departureDate.textContent).toContain('15-06-2023');
    expect(departureDate.textContent).toContain(mockFlight.departureTime);
    expect(arrivalDate.textContent).toContain('15-06-2023');
    expect(arrivalDate.textContent).toContain(mockFlight.arrivalTime);
    expect(fare.textContent).toContain(mockFlight.fare.toString());
  });

  it('should emit closePopup event when close button is clicked', () => {
    spyOn(component.closePopup, 'emit');
    closeBtn = fixture.debugElement.query(By.css('.close'));

    closeBtn.triggerEventHandler('click', null);

    expect(component.closePopup.emit).toHaveBeenCalledWith(false);
  });
});
