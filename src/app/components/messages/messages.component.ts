import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { RealtimeMessagesService } from '../../services/realtime-messages.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
constructor(public global: GlobalService,
  public auth: AuthPocketbaseService,
  public realtimeMessages: RealtimeMessagesService
) {

}
}
