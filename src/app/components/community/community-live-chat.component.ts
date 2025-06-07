import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, NgModel} from "@angular/forms";

@Component({
  selector: 'app-community-live-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community-live-chat.component.html',
  styleUrls: ['./community-live-chat.component.scss']
})
export class CommunityLiveChatComponent {
  messages: { user: string, text: string }[] = [
    { user: 'User1', text: 'Hello!' },
    { user: 'User2', text: 'Hi there!' }
  ];
  input = '';

  sendMessage() {
    if (this.input.trim()) {
      this.messages.push({ user: 'You', text: this.input });
      this.input = '';
    }
  }
}
