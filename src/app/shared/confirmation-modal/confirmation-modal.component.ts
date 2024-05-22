import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {

  @Output() handleConfirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  confirmDelete() {
    this.handleConfirm.emit(true);
  }

  cancelDelete() {
    this.handleConfirm.emit(false);
  }
}
