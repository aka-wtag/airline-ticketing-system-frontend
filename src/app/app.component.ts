import { Component } from '@angular/core';
import { ToastService } from './core/service/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private toastService: ToastService) {}

  public getToastService(): ToastService {
    return this.toastService;
  }
}
