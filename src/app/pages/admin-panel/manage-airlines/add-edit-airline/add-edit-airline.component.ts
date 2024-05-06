import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Airline } from 'src/app/core/interface/airline';
import { AirlineService } from 'src/app/core/service/airline.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-edit-airline',
  templateUrl: './add-edit-airline.component.html',
  styleUrls: ['./add-edit-airline.component.css'],
})
export class AddEditAirlineComponent implements OnInit {
  airlineForm: FormGroup;

  @Input() selectedAirline: Airline | null = null;
  @Input() editMode!: boolean;

  @Output()
  closeForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private airlineService: AirlineService,
    private toastService: ToastService
  ) {
    this.airlineForm = new FormGroup({
      airlineModel: new FormControl(null, [Validators.required]),
      airlineName: new FormControl(null, [Validators.required]),
      numberOfSeats: new FormControl(null, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  ngOnInit(): void {
    if (this.editMode && this.selectedAirline) {
      this.airlineForm.patchValue({
        airlineModel: this.selectedAirline?.airlineModel,
        airlineName: this.selectedAirline?.airlineName,
        numberOfSeats: this.selectedAirline?.numberOfSeats,
      });
    }
  }

  onCloseForm() {
    this.closeForm.emit(false);
  }

  onFormSubmitted() {
    if (this.editMode && this.selectedAirline) {
      this.airlineService
        .updateAirline(this.airlineForm.value, this.selectedAirline.airlineId)
        .subscribe({
          next: () => {
            this.toastService.show('Update successful', true);
          },
          error: () => {
            this.toastService.show('Update failed', false);
          },
          complete: () => {
            this.closeForm.emit(false);
          },
        });
    } else {
      this.airlineService.addAirline(this.airlineForm.value).subscribe({
        next: () => {
          this.toastService.show('Airline added', true);
        },
        error: () => {
          this.toastService.show('Airline was not added', false);
        },
        complete: () => {
          this.closeForm.emit(false);
        },
      });
    }
  }

  isValid(key: string, validatorType: string): boolean {
    return (
      this.airlineForm.get(key)?.errors?.[validatorType] &&
      this.airlineForm.get(key)?.touched
    );
  }

  isFormValid(): boolean{
    if(!this.editMode){
      return this.airlineForm.get('airlineName')!.invalid || this.airlineForm.get('numberOfSeats')!.invalid;
    }

    return this.airlineForm.invalid
  }
}
