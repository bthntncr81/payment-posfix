import { FilterConfig } from '../../../shared-1/filter-system/filter-config.model';

export class ProductListModel {
  id: number;
  category1: string;
  category2: string;
  category3: string;
  companyId: number;
  employeeId: number;
  brand: string;
  variants: VariantListModel[];
}

export class VariantListModel {
  ecommerceProductId: number;
  id: number;
  name: string;
  description: string;
  variantName: string;
  variantIndicator: string;
  thumbImage: string;
  stock: number;
  price: number;
  images: string[];
  variants?: VariantListModel[];
}

export class ProductListFilterModel {
  name?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  companyId?: number;
  price?: RangeModel;
  stock?: RangeModel;
  description?: string;
  contains?: string;
}

export class RangeModel {
  min?: number;
  max?: number;
}

export class ProductListFilterConfigModel {
  id?: FilterConfig;
  name?: FilterConfig;
  category1?: FilterConfig;
  category2?: FilterConfig;
  category3?: FilterConfig;
  companyId?: FilterConfig;
  price?: FilterConfig;
  stock?: FilterConfig;
  description?: FilterConfig;
  contains?: FilterConfig;
}
