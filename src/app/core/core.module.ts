import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    SliderModule,
    ButtonModule,
    ToastModule
  ],
  exports: [

  ],
})
export class CoreModule {}
