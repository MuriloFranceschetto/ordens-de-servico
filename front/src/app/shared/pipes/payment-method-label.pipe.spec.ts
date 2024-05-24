import { PaymentMethodLabelPipe } from './payment-method-label.pipe';

describe('PaymentMethodLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new PaymentMethodLabelPipe();
    expect(pipe).toBeTruthy();
  });
});
