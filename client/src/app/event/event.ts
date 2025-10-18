import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api-service';
import {ActivatedRoute, Router} from '@angular/router';
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
  registrations: any[] = [];
  message = ""
  weather: any

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    // get dynamic route id
    this.id = this.route.snapshot.params['id']
  }

  // fetch event by id when page load
  ngOnInit(): void {
    this.apiService.fetchEventDetail(this.id).subscribe(data => {
      this.event = data

      // get latitude/longitude and get weather data
      const lat = data.latitude
      const long = data.longitude
      this.apiService.getWeather(lat, long).subscribe(data1 => {
        this.weather = data1
      })
    }, () => {
      this.message = "Failed to load event."
    })

    this.apiService.fetchEventRegistrations(this.id).subscribe(data => {
      this.registrations = data;
    }, () => {
      this.message = 'Failed to load registrations.';
    });
  }

  weatherCodeMap: any = {
    0: 'Clear',
    1: 'Mostly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    51: 'Light Rain',
    53: 'Moderate Rain',
    81: 'Showers'
  };
}
