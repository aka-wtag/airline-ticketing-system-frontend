import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Airline } from 'src/app/core/interface/airline';
import { AirlineService } from 'src/app/core/service/airline.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-manage-airlines',
  templateUrl: './manage-airlines.component.html',
  styleUrls: ['./manage-airlines.component.css'],
})
export class ManageAirlinesComponent implements OnInit {
  airlines: Airline[] = [];

  selectedAirline: Airline | null = null;
  showEditAirlineForm: boolean = false;

  editMode: boolean = false;

  airlineSubscription: Subscription | undefined;

  isConfirmationModalOpen: boolean = false;

  constructor(
    private airlineService: AirlineService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getAirlines();
  }

  getAirlines() {
    this.airlineSubscription = this.airlineService.getAllAirlines().subscribe({
      next: (data) => {
        this.airlines = data as Airline[];
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  closeEditAirlineForm() {
    this.showEditAirlineForm = false;
    this.selectedAirline = null;
  }

  getAirlinesOnSuccess() {
    this.getAirlines();
  }

  editAirlineForm(airline: any) {
    this.showEditAirlineForm = true;
    this.selectedAirline = airline;
    this.editMode = true;
  }

  deleteAirline(airlineId: number) {
    this.airlineService.deleteAirline(airlineId).subscribe({
      next: () => {
        this.getAirlines();

        this.toastService.show('Delete successful', true);
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  addAirlineForm() {
    this.showEditAirlineForm = true;
    this.editMode = false;
  }

  openConfirmationModal(airline: Airline) {
    this.selectedAirline = airline;
    this.isConfirmationModalOpen = true;
  }

  closeConfirmationModal(confirmed: boolean) {
    this.isConfirmationModalOpen = false;
    if (confirmed) {
      this.deleteAirline(this.selectedAirline!.airlineId);
    }
  }

  onDeleteConfirmation(confirmed: boolean) {
    this.closeConfirmationModal(confirmed);
  }

  ngOnDestroy(): void {
    if (this.airlineSubscription) {
      this.airlineSubscription.unsubscribe();
    }
  }
}
