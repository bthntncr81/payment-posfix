import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpHelperService {
  apiUrl = environment.apiUrl;
  projectRoute = environment.projectRoute;

  constructor(private httpClient: HttpClient) {}

  getGenericList<T1, T2, T3>(
    controllerName: string,
    methodName: string,
    filter: FilterModel<T2>
  ): Observable<ServiceListResultModel<T1, T3>> {
    return this.httpClient.post(
      `${this.apiUrl}/${this.projectRoute}/${controllerName}/${methodName}`,
      filter
    );
  }

  get<T>(
    controllerName: string,
    methodName: string
  ): Observable<ServiceResultModel<T>> {
    return this.httpClient.get(
      `${this.apiUrl}/${this.projectRoute}/${controllerName}/${methodName}`
    );
  }

  getGenericListWithOutFilter<T>(
    controllerName: string,
    methodName: string
  ): Observable<ServiceResultModel<T>> {
    return this.httpClient.get(`${this.urlFixer(controllerName, methodName)}`);
  }

  genericPost<T1, T2>(
    controllerName: string,
    methodName: string,
    model: T1
  ): Observable<ServiceResultModel<T2>> {
    return this.httpClient.post(
      `${this.urlFixer(controllerName, methodName)}`,
      model
    );
  }
  delete(
    controllerName: string,
    methodName: string,
    id: number
  ): Observable<any> {
    return this.httpClient.delete(
      `${this.urlFixer(controllerName, methodName)}?id=${id}`
    );
  }
  urlFixer(controllerName: string, methodName: string): string {
    return `${this.apiUrl}/${this.projectRoute}/${controllerName}/${methodName}`;
  }
}

export class ServiceResultModel<T> {
  data?: T;
  success?: boolean;
  message?: string;
  statusCode?: HTTPStatusCode;
  messages?: string[];
  totalCount?: number;
}

export class ServiceListResultModel<T1, T2> {
  data?: ListResult<T1, T2>;
  success?: boolean;
  message?: string;
  statusCode?: HTTPStatusCode;
  messages?: string[];
  totalCount?: number;
}

export class ListResult<T1, T2> {
  list?: T1[];
  filter?: T2;
}

export class FilterModel<T> {
  paginationFilter?: PaginationFilterModel;
  sortingFilter?: SortingFilterModel;
  requestFilter?: T;
}

export class PaginationFilterModel {
  take?: number = 10;
  skip?: number;
}

export class SortingFilterModel {
  ListOrderType?: ListOrderTypeEnum;
}

export enum HTTPStatusCode {
  SUCCESS = 200,
  BADREQUEST = 400,
  BADGATEWAY = 500,
}

export enum ListOrderTypeEnum {
  Ascending = 0,
  Descending = 1,
}
