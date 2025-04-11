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
import { PaymentDone, SignalRService } from "./signal-r.service";

@Component({
  selector: "app-pay",
  templateUrl: "./pay.component.html",
  styleUrl: "./pay.component.scss",
})
export class PayComponent {
  user: any;
  price = 0;
  package_name = "";
  priceArray = [
    { key: 1, amount: 4490, name: "Yıllık Starter" },
    { key: 2, amount: 849, name: "Aylık Starter" },
    { key: 3, amount: 9490, name: "Yıllık Professional" },
    { key: 4, amount: 1590, name: "Aylık Professional" },
    { key: 5, amount: 19490, name: "Yıllık Premium" },
  ];
  paymentDoneModel: PaymentDone = {
    userId: 0,
    transactionId: 0,
    subscriptionType: 0,
    amount: 0,
  };
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
  expireDate: string = "";
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
        this.isSuccess = true;

        this.signalR
          .paymentDone(this.paymentDoneModel)
          .subscribe((res: any) => {
            debugger;
            this.onProcess = false;

            window.location.href = res.data;
          });
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
    this.getUser();
    this.price =
      this.priceArray[
        (this.route.snapshot.queryParams as any).packageId - 1
      ].amount;
    this.paymentDoneModel.subscriptionType =
      this.priceArray[
        (this.route.snapshot.queryParams as any).packageId - 1
      ].key;

    this.paymentDoneModel.amount =
      this.priceArray[
        (this.route.snapshot.queryParams as any).packageId - 1
      ].amount;
    this.package_name =
      this.priceArray[
        (this.route.snapshot.queryParams as any).packageId - 1
      ].name;
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
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ], //done
      amount: [this.price, [Validators.required, Validators.min(1)]], //onts
      currency: ["TRY", Validators.required], //onts
      installment: [1, Validators.required], //onts
      orderNumber: [
        Math.floor(
          (Date.now() - new Date(1970, 0, 1).getTime()) / 1000
        ).toString(16),
      ], //onts
      taxNumber: ["24956607526", Validators.required], //done
      emailAddress: [
        "omerbatuhantuncer.workspace@gmail.com",
        [Validators.required, Validators.email],
      ], //done
      name: ["", Validators.required], //done
      surname: ["", Validators.required], //done
      phoneNumber: ["5056916831", [Validators.required]], //done
      addressDesc: ["cart curt", Validators.required], //done
      cityName: ["Düzce", Validators.required], //done
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
      merchantUser: ["VAxH2UuoOaLKcQY1Q5C7xnI9U1Hm3V0y", Validators.required], //onts
      merchantPassword: [
        "h9zhWxKLbkkb0f4Y0FKltAbLwgrlfWuV",
        Validators.required,
      ], //onts
      merchantStorekey: ["123456", Validators.required], //onts
      testPlatform: [false, Validators.required], //onts
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
  getUser() {
    this.signalR
      .getUser((this.route.snapshot.queryParams as any).email)
      .subscribe((res: any) => {
        this.user = res.data;
        this.paymentDoneModel.userId = this.user.id;
        this.paymentDoneModel.transactionId = 1234;
        // this.checkoutForm.get("orderNumber")!.value;
        this.checkoutForm.get("name")?.setValue(this.user.name);
        this.checkoutForm.get("surname")?.setValue(this.user.surname);
        this.checkoutForm
          .get("phoneNumber")
          ?.setValue(this.user.phone.toString());
        this.checkoutForm.get("taxNumber")?.setValue("11111111111");
        this.checkoutForm.get("emailAddress")?.setValue(this.user.email);
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
        }&orderNumber=${this.checkoutForm.get("orderNumber")?.value}&isTest=${
          this.checkoutForm.get("testPlatform")?.value
        }`
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
