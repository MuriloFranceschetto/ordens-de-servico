import { NgClass, NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'my-chip',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './my-chip.component.html',
  styleUrl: './my-chip.component.scss',
})
export class MyChipComponent {
  bgColor = input();
  color = input();
}
