import { Component } from '@angular/core';
import { ToastService } from './service/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(public toastService: ToastService) {}
}
