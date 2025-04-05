import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";

@Injectable({
  providedIn: "root",
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | any;

  constructor(private http: HttpClient) {}

  getUser(mail: string) {
    return this.http.get(
      "https://restapi.posfixmenu.com/api/User/UserDetail/" + mail
    );
  }
  paymentDone(model: PaymentDone) {
    return this.http.post(
      "https://restapi.posfixmenu.com/api/Payment/PaymentDone" , model
    );
  }
  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("wss://payment.scald.shop/pay-hub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log("Connection started"))
      .catch((err: any) => console.log(err));
    this.hubConnection.on("Receive", (res: any) => {
      console.log(res);
    });
  };

  registerTransactionId(id: string) {
    this.hubConnection.invoke("RegisterTransaction", id);
  }

  paymentResult = (updateStatus: any) => {
    this.hubConnection.on("Receive", (res: any) => {
      updateStatus(res);
    });
  };
}

export class PaymentDone {
  userId: number;
  transactionId: number;
  subscriptionType: number;
  amount: number;
}
