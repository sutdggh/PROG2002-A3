import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  fetchHomeEvents(): Observable<any> {
    return this.http.get('http://localhost:3000/api/events/home')
  }

  fetchAllEvents(): Observable<any> {
    return this.http.get('http://localhost:3000/api/events')
  }

  addEvent(formData: any) {
    return this.http.post('http://localhost:3000/api/events', formData);
  }

  updateEvent(id: string, formData: any) {
    return this.http.put('http://localhost:3000/api/events/' + id, formData);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete('http://localhost:3000/api/events/' + id)
  }

  fetchCategories(): Observable<any> {
    return this.http.get('http://localhost:3000/api/categories')
  }

  fetchOrganizations(): Observable<any> {
    return this.http.get('http://localhost:3000/api/organizations')
  }


  fetchSearchEvents(params: any): Observable<any> {
    return this.http.get('http://localhost:3000/api/events/search', { params })
  }

  fetchEventDetail(id: string): Observable<any> {
    return this.http.get('http://localhost:3000/api/events/' + id)
  }

  fetchEventRegistrations(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/events/${id}/registrations`);
  }

  addEventRegistration(id: string, formData: any) {
    return this.http.post(`http://localhost:3000/api/events/${id}/registrations`, formData);
  }
}
