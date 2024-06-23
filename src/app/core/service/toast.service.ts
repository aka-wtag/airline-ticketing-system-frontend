import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<any>();
  toastState = this.toastSubject.asObservable();

  show(message: string, success: boolean): void {
    this.toastSubject.next({ message, success });

    setTimeout(() => {
      this.clear();
    }, 2000);
  }

  clear(): void {
    this.toastSubject.next('');
  }
}
