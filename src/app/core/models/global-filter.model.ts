export class GlobalFilterModel<T> {
  requestFilter: T;
  paginationFilter: PaginationModel;
}

export class PaginationModel {
  take: number;
  skip: number;
}

export class RangeFilterModel {
  min: number;
  max: number;
}

export class ShoppingFilterModel {
  mainCategory?: string;
  subCategory?: string;
  id?: string;
  orderPrice?: number;
  price?: RangeFilterModel;
}

export class BpmFilter {
  mainCategory?: string;
  subCategory?: string;
  id?: string;
  orderPrice?: number;
  price?: RangeFilterModel;
  take: number;
  skip: number;
  generalFilter?: string;
  size?: string;
}
