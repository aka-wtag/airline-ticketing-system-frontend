import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<any>();
  toastState = this.toastSubject.asObservable();

  constructor() {}

  show(message: string, success: boolean) {

    this.toastSubject.next({ message, success });

    setTimeout(() => {
      this.clear();
    }, 2000);
  }

  clear() {
    this.toastSubject.next('');
  }
}
