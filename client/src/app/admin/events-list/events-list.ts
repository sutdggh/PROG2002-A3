import { Component } from '@angular/core';
import {ApiService} from '../../api-service';
import {CommonModule} from '@angular/common';
import {AddEvent} from '../add-event/add-event';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-events-list',
  imports: [CommonModule, AddEvent, RouterModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css'
})
export class EventsList {
  events: any[] = [];
  editing = false;
  selectedEvent: any = null;

  constructor(private apiService: ApiService) {}

  // fetch all events when page load
  ngOnInit() {
    this.getAllEvents();
  }

  getAllEvents() {
    this.apiService.fetchAllEvents().subscribe(data => {
      this.events = data
    });
  }

  // new event set flag
  newEvent() {
    this.selectedEvent = null;
    this.editing = true;
  }

  // edit event set flag
  editEvent(event: any) {
    this.selectedEvent = event;
    this.editing = true;
  }

  // delete event
  deleteEvent(id: number) {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    this.apiService.deleteEvent(id).subscribe(() => {
      this.getAllEvents()
    }, (err: any) => {
      alert(err?.error?.error || "Delete Error.")
    });
  }

  // close modal and refresh event list
  closeEditor(updated: boolean) {
    this.editing = false;
    if (updated) {
      this.getAllEvents();
    }
  }
}
