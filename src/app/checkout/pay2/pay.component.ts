import { HttpClient } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from "ngx-intl-tel-input";
import { PrimeNGConfig } from "primeng/api";

import { InputNumber } from "primeng/inputnumber";
import { CountryModel, CountryService } from "./country.service";
import { IpService } from "./ip.service";
import { SignalRService } from "./signal-r.service";

@Component({
  selector: "app-pay",
  templateUrl: "./pay.component.html",
  styleUrl: "./pay.component.scss",
})
export class PayComponent {
  checkoutForm!: FormGroup;
  basketProducts: any[] = [];
  totalPrice = 0;
  installmentStr = "";
  html: any = "";
  countries: CountryModel[] = [];
  filteredCities1: string[] = [];
  filteredCities2: string[] = [];
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Turkey];
  expireDate: string = "12/25";
  separateDialCode = true;
  order: any;
  isSuccess = false;
  onProcess: boolean = false;
  isError: boolean = false;
  isReponseDone: boolean = false;
  installmentArray: InstallmentListModel[] = [];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private primengConfig: PrimeNGConfig,
    private signalR: SignalRService,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private countryService: CountryService,
    private ipService: IpService,
    private router: Router
  ) {
    this.signalR.startConnection();
    this.signalR.paymentResult((data: any) => {
      this.isReponseDone = true;
      if (data.statu === 1) {
        this.onProcess = false;
        this.isSuccess = true;

        window.location.href =
          "https://scald.shop/payments/iyzico/success/" + this.order.id;
      } else {
        this.onProcess = false;
        this.isError = true;

        window.location.href =
          "https://scald.shop/payments/iyzico/cancel/" + this.order.id;
      }
    });
  }

  getCountries() {
    this.countryService.getCountries().subscribe((res) => {
      this.countries = res;
    });
  }
  getIpAddress() {
    this.ipService.getIpAddress().subscribe((res) => {
      this.checkoutForm.get("ipAddress")?.setValue(res.ip);
    });
  }

  ngOnInit(): void {
    this.getCountries();

    this.primengConfig.ripple = true;
    // Basket from localStorage
    this.checkoutForm = this.fb.group({
      cardNumber: [
        "",
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ], //done
      expiryMonth: [
        null,
        [Validators.required, Validators.min(1), Validators.max(12)],
      ], //done
      expiryYear: [
        null,
        [Validators.required, Validators.min(new Date().getFullYear())],
      ], //done
      cardHolderName: ["", Validators.required], //done
      cardCVV: [
        "000",
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ], //done
      amount: [2000, [Validators.required, Validators.min(1)]], //onts
      currency: ["TRY", Validators.required], //onts
      installment: [1, Validators.required], //onts
      orderNumber: [
        Math.floor(
          (Date.now() - new Date(1970, 0, 1).getTime()) / 1000
        ).toString(16),
      ], //onts
      taxNumber: ["24956607526", Validators.required], //done
      emailAddress: [
        "batuhanntuncerr@hotmail.com",
        [Validators.required, Validators.email],
      ], //done
      name: ["", Validators.required], //done
      surname: ["", Validators.required], //done
      phoneNumber: ["5056916831", [Validators.required]], //done
      addressDesc: ["cart curt", Validators.required], //done
      cityName: ["İstanbul", Validators.required], //done
      country: ["TUR", Validators.required], //done
      postCode: ["81650", Validators.required], //done
      taxOffice: [""], //done
      townName: [""], //done
      confirm: [true, Validators.requiredTrue], //onts
      returnURL: [
        `https://payment.scald.shop/api/Payment/PaymentCallBack?bankCode=`,
        Validators.required,
      ], //onts
      customerIPAddress: ["1.1.1.1", Validators.required], //onts
      bankCode: ["9997", Validators.required], //onts  0046 9997
      merchantID: ["100100000", Validators.required], //onts
      merchantUser: ["", Validators.required], //onts
      merchantPassword: ["", Validators.required], //onts
      merchantStorekey: ["123456", Validators.required], //onts
      testPlatform: [true, Validators.required], //onts
    });

    this.getIpAddress();
    this.checkoutForm.get("cardNumber")?.valueChanges.subscribe((res: any) => {
      if (
        this.installmentStr !=
          this.checkoutForm
            .get("cardNumber")!
            .value.replaceAll(" ", "")
            .substring(0, 6) &&
        res.replaceAll(" ", "").length >= 6 &&
        this.checkoutForm.get("bankCode")!.value == "9997"
      ) {
        let obj = {
          bin: this.checkoutForm
            .get("cardNumber")!
            .value.replaceAll(" ", "")
            .substring(0, 6),
          amount: parseInt(this.checkoutForm.get("amount")!.value),
          currency: 949,
        };
        this.installmentStr = obj.bin;
        this.httpClient
          .post(
            `https://payment.scald.shop/api/Payment/GetInstallment?bankCode=9997&merchantID=DASD&merchantUser=${this.checkoutForm.get(
              "merchantUser"
            )}&merchantPassword=${this.checkoutForm.get(
              "merchantPassword"
            )}&merchantStorekey=123456&orderNumber=DASD`,
            obj
          )
          .subscribe({
            next: (res) => {
              this.installmentArray = (res as any).data.installmentList;
            },
            error: (err) => {},
            complete: () => {},
          }); // Handle form submission, e.g., send it to the backend
      }
    });
  }



  onSubmit() {
    this.checkoutForm
      .get("returnURL")
      ?.setValue(
        `https://payment.scald.shop/api/Payment/PaymentCallBack?bankCode=${
          this.checkoutForm.get("bankCode")?.value
        }&merchantID=${
          this.checkoutForm.get("merchantID")?.value
        }&merchantUser=${
          this.checkoutForm.get("merchantUser")?.value
        }&merchantPassword=${
          this.checkoutForm.get("merchantPassword")?.value
        }&merchantStorekey=${
          this.checkoutForm.get("merchantStorekey")?.value
        }&orderNumber=${this.checkoutForm.get("orderNumber")?.value}`
      );

    var nameArray = this.name.split(" ");
    var surname = nameArray[nameArray.length - 1];
    (nameArray as Array<string>).splice(nameArray.length - 1, 1);
    var firstName = "";
    nameArray.forEach((element: string) => {
      firstName = firstName + " " + element;
    });
    this.checkoutForm
      .get("expiryMonth")
      ?.setValue(this.expireDate.substring(0, 2));

    this.checkoutForm.get("name")?.setValue(firstName);
    this.checkoutForm.get("surname")?.setValue(surname);
    this.checkoutForm
      .get("expiryYear")
      ?.setValue("20" + this.expireDate.substring(3, 5));

    this.checkoutForm
      .get("cardNumber")
      ?.setValue(
        (this.checkoutForm.get("cardNumber")?.value! as string).replaceAll(
          " ",
          ""
        )
      );

    this.checkoutForm
      .get("cardCVV")
      ?.setValue(this.checkoutForm.get("cardCVV")?.value!.toString());
    if (this.checkoutForm.valid) {
      this.httpClient
        .post(
          "https://payment.scald.shop/api/Payment/VirtualPOS3DResponse",
          this.checkoutForm.value
        )
        .subscribe({
          next: (res) => {
            this.onProcess = true;
            this.signalR.registerTransactionId(
              (res as any).data.conversationId
            );
            const blob = new Blob([(res as any).data.content], {
              type: "text/html",
            });
            const obj = URL.createObjectURL(blob);
            this.html = this.sanitizer.bypassSecurityTrustResourceUrl(obj);
          },
          error: (err) => {},
          complete: () => {},
        }); // Handle form submission, e.g., send it to the backend
    } else {
      // Handle form validation errors
    }
  }

  // Getter for basketItems FormArray
  get basketItems(): FormArray {
    return this.checkoutForm.get("basketItems") as FormArray;
  }

  makeid(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  changeCities(event: any, count: number) {
    var index = this.countries.findIndex((x) => x.countryName == event.value);

    if (count == 1) {
      this.filteredCities1 = this.countries[index].cities;
    } else {
      this.filteredCities2 = this.countries[index].cities;
    }
  }
  validateStep(nextCallback: any) {
    // Proceed to the next step
    nextCallback.emit();
  }

  get name() {
    return this.checkoutForm.get("cardHolderName")!.value;
  }

  get card4() {
    return this.checkoutForm
      .get("cardNumber")!
      .value.replaceAll(" ", "")
      .substring(0, 4);
  }

  get card8() {
    return this.checkoutForm
      .get("cardNumber")!
      .value.replaceAll(" ", "")
      .substring(4, 8);
  }

  get card12() {
    return this.checkoutForm
      .get("cardNumber")!
      .value.replaceAll(" ", "")
      .substring(8, 12);
  }

  get card16() {
    return this.checkoutForm
      .get("cardNumber")!
      .value.replaceAll(" ", "")
      .substring(12, 16);
  }

  get expireYear() {
    return this.expireDate.substring(3, 5);
  }

  get expireMonth() {
    return this.expireDate.substring(0, 2);
  }
  get cvv() {
    return this.checkoutForm.get("cardCVV")!.value;
  }

  get amount() {
    return parseInt(this.checkoutForm.get("amount")!.value);
  }
  @ViewChild("inputNumberElement") inputNumberElement!: InputNumber;

  ngAfterViewInit() {
    const nativeInput = this.inputNumberElement.input.nativeElement;
    nativeInput.addEventListener("focus", (event) => {
      var elem = document.getElementById("card-naber");
      if (elem?.style) {
        elem!.style!.transform = "rotateY(180deg)";
      }
    });

    nativeInput.addEventListener("blur", () => {
      var elem = document.getElementById("card-naber");
      if (elem?.style) {
        elem!.style!.transform = "rotateY(0deg)";
      }
    });
  }
}

export class InstallmentListModel {
  count: number;
  customerCostCommissionRate: number;
}
