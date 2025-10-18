import { Component } from '@angular/core';
import {ApiService} from '../../api-service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-events-list',
  imports: [CommonModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css'
})
export class EventsList {
  events: any[] = [];
  editing = false;
  selectedEvent: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.apiService.fetchAllEvents().subscribe(data => this.events = data);
  }

  newEvent() {
    this.selectedEvent = null;
    this.editing = true;
  }

  editEvent(event: any) {
    this.selectedEvent = event;
    this.editing = true;
  }

  deleteEvent(id: number) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    this.apiService.deleteEvent(id).subscribe(() => this.loadEvents());
  }

  closeEditor(updated: boolean) {
    this.editing = false;
    if (updated) this.loadEvents();
  }
}
