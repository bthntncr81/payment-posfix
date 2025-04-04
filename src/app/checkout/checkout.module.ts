import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// PrimeNG Components
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { PanelModule } from "primeng/panel";
import { RadioButtonModule } from "primeng/radiobutton";
import { RippleModule } from "primeng/ripple";
import { StepperModule } from "primeng/stepper";
import { StepsModule } from "primeng/steps";
import { CheckoutRoutingModule } from "./checkout-routing.module";
import { CreditCardNumberMaskDirective } from "./pay2/creditCartNumberMask";
import { CreditCardExpiryDateMaskDirective } from "./pay2/expireMonthMask";
import { PayComponent } from "./pay2/pay.component";

@NgModule({
  declarations: [
    PayComponent,
    CreditCardNumberMaskDirective,
    CreditCardExpiryDateMaskDirective,
  ],
  imports: [
    CommonModule,
    DialogModule,
    RadioButtonModule,
    PanelModule,
    NgxIntlTelInputModule,
    StepsModule,
    InputNumberModule,
    StepperModule,
    ReactiveFormsModule,
    FormsModule, // If needed for other purposes
    CardModule,
    InputTextModule,
    ButtonModule,
    RippleModule,

    DropdownModule,
    InputMaskModule,
    CalendarModule,
    CheckoutRoutingModule,
  ],
})
export class CheckoutModule {}
