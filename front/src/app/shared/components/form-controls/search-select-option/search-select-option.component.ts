import { Component, ViewEncapsulation, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-search-select-option',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './search-select-option.component.html',
  styleUrl: './search-select-option.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SearchSelectOptionComponent {

  public readonly searchControl = input.required<FormControl>();

  public readonly onNewClick = output<void>();

  public focus(): void {
    let input = document.getElementsByClassName('search-option').item(0)
    input?.scrollIntoView()
    document.getElementById('search')?.focus();
  }

}
