import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CarouselModule } from "ngx-owl-carousel-o";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { SidebarModule } from "primeng/sidebar";
import { StepperModule } from "primeng/stepper";
import { ToastModule } from "primeng/toast";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { KadirProductService } from "./kadir-product.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    ToastModule,
    CarouselModule,
    StepperModule,
    BrowserModule,
    SidebarModule,
    ButtonModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DialogModule,
  ],
  providers: [KadirProductService, MessageService],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
