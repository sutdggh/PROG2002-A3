import { Routes } from '@angular/router';
import { Index } from './index';
import { Search } from './search/search';
import { Event } from './event/event';
import { Register } from './register/register';
import {Admin} from './admin/admin';

export const routes: Routes = [
  {
    path: '',
    component: Index
  },
  {
    path: 'search',
    component: Search
  },
  {
    path: 'event/:id',
    component: Event
  },
  {
    path: 'register/:id',
    component: Register
  },
  {
    path: 'admin',
    component: Admin
  }
];
