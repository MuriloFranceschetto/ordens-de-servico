import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserSelectComponent} from './user-select.component';
import {FormControl, FormControlName, FormGroup} from "@angular/forms";
import {IUser} from "../../../models/User";

describe('UserSelectComponent', () => {
    let component: UserSelectComponent;
    let fixture: ComponentFixture<UserSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserSelectComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserSelectComponent);

        const formGroup = new FormGroup({
            user: new FormControl<IUser>(null),
        });

        fixture.componentRef.setInput('formGroup', formGroup);
        fixture.componentRef.setInput('formControlName', 'user');
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
