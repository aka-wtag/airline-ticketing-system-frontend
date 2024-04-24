import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-passenger-page',
  templateUrl: './passenger-page.component.html',
})
export class PassengerPageComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onLogout() {
    this.authService.onLogout();
  }
}
