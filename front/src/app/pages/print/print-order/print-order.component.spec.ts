import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrintOrderComponent} from './print-order.component';
import {signal} from "@angular/core";

describe('PrintOrderComponent', () => {
    let component: PrintOrderComponent;
    let fixture: ComponentFixture<PrintOrderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({imports: [PrintOrderComponent]})
            .compileComponents();

        fixture = TestBed.createComponent(PrintOrderComponent);
        fixture.componentRef.setInput('id', 'Teste teste teste');
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
