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

  currentPage = 1;
  itemsPerPage = 3;
  totalItems = 0;

  constructor(
    private passengerService: PassengerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPassengers();
  }

  loadPassengers(): void {
    this.passengerService
      .getPassengers(this.currentPage - 1, this.itemsPerPage)
      .subscribe((response: any) => {
        this.passengers = response.content;
        this.totalItems = response.totalElements;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPassengers();
  }

  deletePassenger(passengerId: number): void {
    this.passengerService.deletePassenger(passengerId).subscribe({
      next: () => {
        this.loadPassengers();

        this.toastService.show('Passenger deleted', true);
      },
      error: () => {
        this.toastService.show('Some error occured', false);
      },
    });
  }

  openConfirmationModal(passengerId: number): void {
    this.selectedPassengerId = passengerId;
    this.isConfirmationModalOpen = true;
  }

  closeConfirmationModal(confirmed: boolean): void {
    this.isConfirmationModalOpen = false;
    if (confirmed) {
      this.deletePassenger(this.selectedPassengerId);
    }
  }

  onDeleteConfirmation(confirmed: boolean): void {
    this.closeConfirmationModal(confirmed);
  }
}
