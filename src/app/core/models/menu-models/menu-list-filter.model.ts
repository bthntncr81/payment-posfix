import { RangeModel } from "../filter-models";

export class ProductListFilterModel {
  id: number;
  name: string;
  categoryId: number;
  price: RangeModel;
  stock: RangeModel;
  categoryEnum: Category;
  collectionEnum: Collection;
}

export enum Category {
  TSHIRT = 0,
  SHORT = 1,
  SWEAT = 2,
}

export enum Collection {
  YINGYANG = 0,
}
