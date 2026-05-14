import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UnityQuantityComponent} from './unity-quantity.component';
import {signal} from "@angular/core";

describe('UnityQuantityComponent', () => {
    let component: UnityQuantityComponent;
    let fixture: ComponentFixture<UnityQuantityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UnityQuantityComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UnityQuantityComponent);
        fixture.componentRef.setInput('quantity', signal<number>(10));
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
