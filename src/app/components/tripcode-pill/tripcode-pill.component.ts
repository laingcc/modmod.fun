import {Component, Input} from '@angular/core';
import {NgIf, SlicePipe} from "@angular/common";

@Component({
  selector: 'app-tripcode-pill',
  standalone: true,
  imports: [
    SlicePipe,
    NgIf
  ],
  templateUrl: './tripcode-pill.component.html',
  styleUrl: './tripcode-pill.component.scss'
})
export class TripcodePillComponent {

  @Input() author: string;
  @Input() isOp: boolean = false;

  getColorForAuthor(authorHash: string){
    let color = ''
    for(let i = 0; color.length < 6; i++){
      color = color.concat(authorHash.charCodeAt(i).toString(16))
    }
    return `#${color}`

  }

}
