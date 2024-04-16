import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passenger-page',
  templateUrl: './passenger-page.component.html',
  styleUrls: ['./passenger-page.component.css'],
})
export class PassengerPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogoutClick() {
    this.authService.onLogout();
    this.router.navigate(['/login']);
  }
}
