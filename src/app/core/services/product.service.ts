import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FilterModel,
  HttpHelperService,
  ServiceListResultModel,
} from '../helpers/http-helper.service';
import {
  ProductListFilterConfigModel,
  ProductListFilterModel,
  ProductListModel,
} from '../models/product-models/global-product-model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpHelper: HttpHelperService) {}

  getProducts(
    filter: FilterModel<ProductListFilterModel>
  ): Observable<
    ServiceListResultModel<ProductListModel, ProductListFilterConfigModel>
  > {
    return this.httpHelper.getGenericList<
      ProductListModel,
      ProductListFilterModel,
      ProductListFilterConfigModel
    >('EcommerceProduct', 'ProductListGrouped', filter);
  }

  getProductsGrouped(
    filter: FilterModel<ProductListFilterModel>
  ): Observable<
    ServiceListResultModel<ProductListModel, ProductListFilterConfigModel>
  > {
    return this.httpHelper.getGenericList<
      ProductListModel,
      ProductListFilterModel,
      ProductListFilterConfigModel
    >('EcommerceProduct', 'ProductListGrouped', filter);
  }
}
