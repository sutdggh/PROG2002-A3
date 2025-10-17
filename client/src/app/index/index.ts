import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {Header} from '../header/header';

@Component({
  selector: 'app-index',
  imports: [CommonModule, RouterModule, Header],
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index implements OnInit {
  events: any[] = []

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.apiService.fetchHomeEvents().subscribe(data => {
      this.events = data
    })
  }

  isPast(event: any): boolean {
    return event.end_datetime && new Date(event.end_datetime) < new Date()
  }

  goEvent(event: any): void {
    this.router.navigate(['/event', event.id])
  }
}
