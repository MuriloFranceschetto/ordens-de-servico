import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KilogramQuantityComponent} from './kilogram-quantity.component';
import {signal} from "@angular/core";

describe('KilogramQuantityComponent', () => {
    let component: KilogramQuantityComponent;
    let fixture: ComponentFixture<KilogramQuantityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KilogramQuantityComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(KilogramQuantityComponent);
        fixture.componentRef.setInput('quantity', signal<number>(10));
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
