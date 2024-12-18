import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent {

  constructor(
    private dialog: MatDialog
  ) {
  }

}
