import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [CommonModule, RouterModule],
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index implements OnInit {
  events: any[] = []

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.fetchHomeEvents().subscribe(data => {
      this.events = data
    })
  }

  isPast(event: any): boolean {
    return event.end_datetime && new Date(event.end_datetime) < new Date()
  }
}
