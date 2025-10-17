import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {Header} from '../header/header';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, RouterModule, Header],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  categories: any[] = []

  date = ''
  location = ''
  category_id = ''

  events: any[] = []
  message = ""


  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
  }

  // fetch categories when page load
  ngOnInit(): void {
    this.apiService.fetchCategories().subscribe(data => {
      this.categories = data
    }, () => {
      this.message = "Failed to load categories."
    })
  }

  search() {
    // create search parameters
    const params = {
      date: this.date,
      location: this.location,
      category_id: this.category_id
    }
    // search events
    this.apiService.fetchSearchEvents(params).subscribe(data => {
      this.events = data
    }, () => {
      this.message = "Failed to load events."
    })
  }

  // clear search input value and event list
  clear() {
    this.date = ''
    this.location = ''
    this.category_id = ''
    this.events = []
  }

  // Determine whether the current event has ended
  isPast(event: any): boolean {
    return event.end_datetime && new Date(event.end_datetime) < new Date()
  }

  // go to event detail page
  goEvent(event: any): void {
    this.router.navigate(['/event', event.id])
  }
}
