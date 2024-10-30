import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GlobalService } from './services/global.service';
import { SidebarComponent } from "./components/ui/sidebar/sidebar.component";
import { TopNavbarComponent } from './components/ui/top-navbar/top-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    HomeComponent, 
    SidebarComponent,
  TopNavbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'qualitydetailing';
  constructor (
    public global: GlobalService
  ){}
}
