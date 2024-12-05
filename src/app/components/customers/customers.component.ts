import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { RealtimeCustomersService } from '../../services/realtime-customers.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  constructor(public global: GlobalService,
    public realtimeCustomers: RealtimeCustomersService
  ) {}
}
