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
  
  currentPage = 1;
  itemsPerPage = 3;
  totalItems = 0;

  constructor(
    private airlineService: AirlineService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAirlines();
  }

  loadAirlines(): void {
    this.airlineService
      .getAirlines(this.currentPage - 1, this.itemsPerPage)
      .subscribe((response: any) => {
        this.airlines = response.content;
        this.totalItems = response.totalElements;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAirlines();
  }

  closeEditAirlineForm(): void {
    this.showEditAirlineForm = false;
    this.selectedAirline = null;
  }

  editAirlineForm(airline: Airline): void {
    this.showEditAirlineForm = true;
    this.selectedAirline = airline;
    this.editMode = true;
  }

  deleteAirline(airlineId: number): void {
    this.airlineService.deleteAirline(airlineId).subscribe({
      next: () => {
        this.loadAirlines();

        this.toastService.show('Delete successful', true);
      },
      error: (err) => {
        this.toastService.show(err, false);
      },
    });
  }

  addAirlineForm(): void {
    this.showEditAirlineForm = true;
    this.editMode = false;
  }

  openConfirmationModal(airline: Airline): void {
    this.selectedAirline = airline;
    this.isConfirmationModalOpen = true;
  }

  closeConfirmationModal(confirmed: boolean): void {
    this.isConfirmationModalOpen = false;
    if (confirmed) {
      this.deleteAirline(this.selectedAirline!.airlineId);
    }
  }

  onDeleteConfirmation(confirmed: boolean): void {
    this.closeConfirmationModal(confirmed);
  }

  ngOnDestroy(): void {
    if (this.airlineSubscription) {
      this.airlineSubscription.unsubscribe();
    }
  }
}
