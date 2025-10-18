import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Header} from '../header/header';
import {EventsList} from './events-list/events-list';
import {RegistrationsList} from './registrations-list/registrations-list';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, Header, EventsList, RegistrationsList],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  tab = 'events';
}
