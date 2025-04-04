import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';

import { BasketItemAddModel } from '../../auth/auth-service';
import { BasketService } from '../../shared-1/services/basket.service';
import { LoaderService } from '../../shared-1/services/loader.service';
import { MessageHelperService } from '../services/message-helper.service';

@Injectable({
  providedIn: 'root',
})
export class CommonHelperService {
  constructor(
    private basketService: BasketService,
    private messageHelperService: MessageHelperService,
    private loaderService: LoaderService,
    private _sanitizer: DomSanitizer
  ) {}
  makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  getMe() {
    return jwtDecode(localStorage.getItem('auth_token')!);
  }

  addToBasketModel(variantId: number, itemCount: number) {
    let addToBasketModel: BasketItemAddModel = {
      variantId: variantId,
      guid: localStorage.getItem('basket-guid')
        ? localStorage.getItem('basket-guid')!
        : 'c',
      itemCount: itemCount,
    };

    if (localStorage.getItem('auth_token')) {
      addToBasketModel.clientId = localStorage.getItem('auth_token')
        ? (jwtDecode(localStorage.getItem('auth_token')!) as any).Id
          ? (jwtDecode(localStorage.getItem('auth_token')!) as any).Id
          : null
        : null;
    }

    this.basketService.addBasket(addToBasketModel).subscribe((res) => {
      this.messageHelperService.showSuccess('Ürün Sepete Eklendi');

      localStorage.setItem('basket-guid', res.data!.guid);
      this.basketService.setBasket();
    });
  }
  removeToBasketModel(variantId: number) {
    let addToBasketModel: BasketItemAddModel = {
      variantId: variantId,
      guid: localStorage.getItem('basket-guid')
        ? localStorage.getItem('basket-guid')!
        : 'c',
    };
    if (localStorage.getItem('auth_token')) {
      addToBasketModel.clientId = localStorage.getItem('auth_token')
        ? (jwtDecode(localStorage.getItem('auth_token')!) as any).Id
          ? (jwtDecode(localStorage.getItem('auth_token')!) as any).Id
          : null
        : null;
    }
    this.basketService.removeBasket(addToBasketModel).subscribe((res) => {
      this.basketService.setBasket();
    });
  }

  removeAllBasketItems() {
    localStorage.getItem('basket');
  }

  getImage(img: string) {
    if (img) {
      if (img.startsWith('http') || img.startsWith('data')) {
        return img;
      } else {
        return this._sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpg;base64,' + img
        );
      }
    } else {
      return img;
    }
  }
  get messageHelper(): MessageHelperService {
    return this.messageHelperService;
  }

  get loader(): LoaderService {
    return this.loaderService;
  }
}
