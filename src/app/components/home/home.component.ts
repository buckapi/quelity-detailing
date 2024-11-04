import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { TopNavbarComponent } from '../ui/top-navbar/top-navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TopNavbarComponent,
    CommonModule, 
    
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor (
  public global: GlobalService
){}
}
