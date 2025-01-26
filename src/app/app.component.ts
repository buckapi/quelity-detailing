import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GlobalService } from './services/global.service';
import { SidebarComponent } from "./components/ui/sidebar/sidebar.component";
import { TopNavbarComponent } from './components/ui/top-navbar/top-navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { FormRequestComponent } from "./components/form-request/form-request.component";
import { AuthPocketbaseService } from './services/auth-pocketbase.service';
import { SupervisorsComponent } from './components/supervisors/supervisors.component';
import { TechnicalsComponent } from './components/technicals/technicals.component';
import { WorkInstructionsComponent } from './components/work-instructions/work-instructions.component';
import { HttpClientModule } from '@angular/common/http'; 
import { WorkinstructiondetailComponent } from './components/workinstructiondetail/workinstructiondetail.component';
import { CustomersComponent } from './components/customers/customers.component';
import { MessagesComponent } from './components/messages/messages.component';
import { DefectsModalComponent } from './components/defects-modal/defects-modal.component';
import { ReportsComponent } from './components/reports/reports.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SupervisorsComponent,
    CommonModule,
    RouterOutlet,
    HomeComponent,
    SidebarComponent,
    TopNavbarComponent,
    RegisterComponent,
    LoginComponent,
    FormRequestComponent,
    TechnicalsComponent,
    WorkInstructionsComponent,
    HttpClientModule,
    WorkinstructiondetailComponent,
    CustomersComponent,
    MessagesComponent,
    DefectsModalComponent,
    ReportsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'qualitydetailing';
  constructor (
    public global: GlobalService,
    public auth:AuthPocketbaseService
  ){
    this.auth.permision();  
  }
}
