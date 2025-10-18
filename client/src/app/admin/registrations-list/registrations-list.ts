import { Component } from '@angular/core';
import {ApiService} from '../../api-service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-registrations-list',
  imports: [CommonModule],
  templateUrl: './registrations-list.html',
  styleUrl: './registrations-list.css'
})
export class RegistrationsList {
  registrations: any[] = [];

  constructor(private apiService: ApiService) {}

  // fetch all registrations when page load
  ngOnInit() {
    this.getAllRegistrations();
  }

  getAllRegistrations() {
    this.apiService.fetchAllRegistrations().subscribe(data => {
      this.registrations = data
    });
  }

  // delete registrations
  deleteRegistration(id: number) {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }
    this.apiService.deleteRegistration(id).subscribe(() => {
      this.getAllRegistrations()
    }, (err) => {
      alert(err?.error?.error || "Delete Error.")
    });
  }
}
