import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DELETE_ICON, EDIT_ICON } from 'src/app/core/constants/icons';
import { ICON_HEIGHT, ICON_WIDTH } from 'src/app/core/constants/variables';
import { Airline } from 'src/app/core/interface/airline';
import { AirlineService } from 'src/app/core/service/airline.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-manage-airlines',
  templateUrl: './manage-airlines.component.html',
  styleUrls: ['./manage-airlines.component.css'],
})
export class ManageAirlinesComponent implements OnInit, OnDestroy {
  airlines: Airline[] = [];

  selectedAirline: Airline | null = null;
  showEditAirlineForm: boolean = false;

  editMode: boolean = false;

  private destroy$ = new Subject<void>();

  isConfirmationModalOpen: boolean = false;

  editIcon = EDIT_ICON;
  deleteIcon = DELETE_ICON;

  iconWidth = ICON_WIDTH;
  iconHeight = ICON_HEIGHT;

  constructor(
    private airlineService: AirlineService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getAirlines();
  }

  getAirlines() {
    this.airlineService
      .getAllAirlines()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    this.airlineService
      .deleteAirline(airlineId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  onDeleteConfirmation(confirmed: boolean): void {
    this.closeConfirmationModal(confirmed);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
