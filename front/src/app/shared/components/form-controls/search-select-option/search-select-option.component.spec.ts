import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchSelectOptionComponent} from './search-select-option.component';
import {FormControl} from "@angular/forms";

describe('SearchSelectOptionComponent', () => {
    let component: SearchSelectOptionComponent;
    let fixture: ComponentFixture<SearchSelectOptionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchSelectOptionComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SearchSelectOptionComponent);

        fixture.componentRef.setInput('searchControl', new FormControl());
        fixture.componentRef.setInput('showCreationBtn', true);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
