import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Header} from '../header/header';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [Header, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  id: string = '';
  event: any;
  form: any = {
    registrant_name: '',
    contact_email: '',
    contact_phone: '',
    tickets: 1,
    notes: ''
  };
  message = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  // fetch event when page load
  ngOnInit(): void {
    this.apiService.fetchEventDetail(this.id).subscribe(data => {
      this.event = data
    }, () => {
      this.message = "Failed to load event."
    })
  }

  submitRegistration(): void {
    this.message = '';

    // check required inputs
    if (!this.form.registrant_name || !this.form.contact_email || !this.form.tickets) {
      this.message = 'Name, email, and tickets are required.'
      return
    }

    // add registration
    this.apiService.addEventRegistration(this.id, this.form).subscribe(
      (res: any) => {
        this.message = res.message || 'Registration successful!';
        this.clear();
      },
      (err) => {
        this.message = err.error?.error || 'Failed to submit registration.';
      }
    );
  }

  // clear form value and message
  clear(): void {
    this.form = {
      registrant_name: '',
      contact_email: '',
      contact_phone: '',
      tickets: 1,
      notes: ''
    };
    this.message = ''
  }
}
