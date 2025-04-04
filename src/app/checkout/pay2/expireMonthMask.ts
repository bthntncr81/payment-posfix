import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCreditCardExpiryDateMask]',
})
export class CreditCardExpiryDateMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    let input = this.el.nativeElement.value;
    input = input.replace(/\D/g, ''); // Remove non-digit characters
    let formattedInput = '';

    // Check if first two characters (the month) are valid
    if (input.length >= 2) {
      const month = parseInt(input.substring(0, 2), 10);
      if (month < 1 || month > 12) {
        // If month is not valid, default to '12' (max valid month)
        formattedInput = '12';
      } else {
        formattedInput = input.substring(0, 2); // Set valid month
      }

      if (input.length > 2) {
        formattedInput += '/';
        formattedInput += input.substring(2, 4); // Add the year part
      }
    } else {
      formattedInput = input;
    }

    // Update the input value
    this.el.nativeElement.value = formattedInput;
  }
}
