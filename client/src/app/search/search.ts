import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  categories: any[] = []

  date = ''
  location = ''
  category_id = ''

  events: any[] = []


  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.fetchCategories().subscribe(data => {
      this.categories = data
    })
  }

  search() {
    const params = {
      date: this.date,
      location: this.location,
      category_id: this.category_id
    }
    this.apiService.fetchSearchEvents(params).subscribe(data => {
      this.events = data
    })
  }

  clear() {
    this.date = ''
    this.location = ''
    this.category_id = ''
    this.events = []
  }

  isPast(event: any): boolean {
    return event.end_datetime && new Date(event.end_datetime) < new Date()
  }
}
