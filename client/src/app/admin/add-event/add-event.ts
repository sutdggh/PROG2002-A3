import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api-service';
@Component({
  selector: 'app-add-event',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-event.html',
  styleUrl: './add-event.css'
})
export class AddEvent {
  @Input() eventData: any;
  @Input() width: number = 400;
  @Output() close = new EventEmitter<boolean>();

  form: any = {};
  categories: any[] = [];
  organizations: any[] = [];
  message = ""

  constructor(private apiService: ApiService) {}

  // fetch categories and organizations when page load
  ngOnInit() {
    // fill form when the eventData exist
    if (this.eventData) {
      this.form = {
        ...this.eventData,
        start_datetime: this.eventData.start_datetime.replace('T', ' ').replace('Z', ''), // handle date format
        end_datetime: this.eventData.end_datetime?.replace('T', ' ').replace('Z', ''),
      }
    } else {
      this.form = {}
    }

    // fetch categories
    this.apiService.fetchCategories().subscribe(data => {
      this.categories = data
    })
    // fetch organizations
    this.apiService.fetchOrganizations().subscribe(data => {
      this.organizations = data
    })
  }

  save() {
    // reset message
    this.message = '';

    // validate required fields
    if (!this.form.org_id) {
      this.message = 'Please select a organization.';
      return
    }

    if (!this.form.category_id) {
      this.message = 'Please select a category.';
      return
    }

    if (!this.form.name) {
      this.message = 'Please enter the name.';
      return
    }

    if (!this.form.start_datetime) {
      this.message = 'Please enter the start datetime.';
      return
    }

    // add or update event
    if (this.eventData) {
      this.apiService.updateEvent(this.form.id, this.form).subscribe(() => {
        this.close.emit(true)
      }, (err) => {
        this.message = err?.error?.errors?.join(',') || "Update Error."
      })
    } else {
      this.apiService.addEvent(this.form).subscribe(() => {
        this.close.emit(true)
      }, (err) => {
        this.message = err?.error?.errors?.join(',') || "Add Error."
      })
    }
  }

  closeModal() {
    this.close.emit(false);
  }
}
