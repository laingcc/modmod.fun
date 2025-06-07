import { Component } from '@angular/core';
import {CommunityLiveChatComponent} from "./community-live-chat.component";

@Component({
  selector: 'app-community',
  standalone: true,
  templateUrl: './community.component.html',
  imports: [
    CommunityLiveChatComponent
  ],
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent {}
