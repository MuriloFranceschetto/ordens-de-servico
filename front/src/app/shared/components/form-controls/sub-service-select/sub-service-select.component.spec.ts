import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SubServiceSelectComponent} from './sub-service-select.component';
import {FormControl, FormGroup} from "@angular/forms";
import {IUser} from "../../../models/User";

describe('SubServiceSelectComponent', () => {
    let component: SubServiceSelectComponent;
    let fixture: ComponentFixture<SubServiceSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SubServiceSelectComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SubServiceSelectComponent);

        const formGroup = new FormGroup({
            subservice: new FormControl(null),
        });

        fixture.componentRef.setInput('formGroup', formGroup);
        fixture.componentRef.setInput('formControlName', 'subservice');
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
