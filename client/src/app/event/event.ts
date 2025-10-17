import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Header} from '../header/header';

@Component({
  selector: 'app-event',
  imports: [CommonModule, Header],
  templateUrl: './event.html',
  styleUrl: './event.css'
})
export class Event implements OnInit {
  id: string = ""
  event: any

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params['id']
  }

  ngOnInit(): void {
    this.apiService.fetchEventDetail(this.id).subscribe(data => {
      this.event = data
    })
  }

}
