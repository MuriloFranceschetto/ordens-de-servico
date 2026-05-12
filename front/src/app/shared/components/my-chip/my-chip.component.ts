import { NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
    selector: 'my-chip',
    imports: [NgStyle],
    templateUrl: './my-chip.component.html',
    styleUrl: './my-chip.component.scss'
})
export class MyChipComponent {
  bgColor = input();
  color = input();
}
