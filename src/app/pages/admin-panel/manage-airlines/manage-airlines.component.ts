import { Component, OnInit } from '@angular/core';
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

  constructor(
    private airlineService: AirlineService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.airlineService.airlines$.subscribe((data) => {
      this.airlines = data;
    });

    this.airlineService.getAllAirlines().subscribe();
  }

  closeEditAirlineForm() {
    this.showEditAirlineForm = false;
    this.selectedAirline = null;
  }

  editAirlineForm(airline: any) {
    this.showEditAirlineForm = true;
    this.selectedAirline = airline;
    this.editMode = true;
  }

  deleteAirline(airlineId: number) {
    this.airlineService.deleteAirline(airlineId).subscribe({
      next: () => {
        this.toastService.show('Update successful', true);
      },
      error: () => {
        this.toastService.show('Update failed', false);
      },
    });
  }

  addAirlineForm() {
    this.showEditAirlineForm = true;
    this.editMode = false;
  }
}
