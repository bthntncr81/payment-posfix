import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCreditCardNumberMask]'
})
export class CreditCardNumberMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    const input = this.el.nativeElement.value;
    this.el.nativeElement.value = this.formatCreditCardNumber(input);
  }

  // Method to format input as 4444 4444 4444 4444
  formatCreditCardNumber(value: string): string {
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');

    // Limit the input to 16 digits
    if (value.length > 16) {
      value = value.substring(0, 16);
    }

    // Add a space every 4 digits
    const sections = value.match(/.{1,4}/g);
    return sections ? sections.join(' ') : value;
  }
}
