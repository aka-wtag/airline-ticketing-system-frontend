import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Passenger } from 'src/app/core/interface/passenger';
import { PassengerService } from 'src/app/core/service/passenger.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-manage-passengers',
  templateUrl: './manage-passengers.component.html',
  styleUrls: ['./manage-passengers.component.css'],
})
export class ManagePassengersComponent implements OnInit {
  passengers: Passenger[] = [];

  passengerSubscription: Subscription | undefined;

  isConfirmationModalOpen: boolean = false;

  selectedPassengerId!: number;

  constructor(
    private passengerService: PassengerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getPassengers();
  }

  getPassengers() {
    this.passengerSubscription = this.passengerService
      .getAllPassengers()
      .subscribe({
        next: (data) => {
          this.passengers = data as Passenger[];
        },
        error: (err) => {
          this.toastService.show(err, false);
        },
      });
  }

  deletePassenger(passengerId: number) {
    this.passengerService.deletePassenger(passengerId).subscribe({
      next: () => {
        this.getPassengers();

        this.toastService.show('Passenger deleted', true);
      },
      error: () => {
        this.toastService.show('Some error occured', false);
      },
    });
  }

  openConfirmationModal(passengerId: number) {
    this.selectedPassengerId = passengerId;
    this.isConfirmationModalOpen = true;
  }

  closeConfirmationModal(confirmed: boolean) {
    this.isConfirmationModalOpen = false;
    if (confirmed) {
      this.deletePassenger(this.selectedPassengerId);
    }
  }

  onDeleteConfirmation(confirmed: boolean) {
    this.closeConfirmationModal(confirmed);
  }
}
