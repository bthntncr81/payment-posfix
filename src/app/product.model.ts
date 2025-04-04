export class ProductModel {
  Id: number;
  Category1: string;
  Category2: string;
  Category3: string;
  CompanyId: number;
  EmployeeId: number;
  Name: string;
  Description: string;
  Images: string[];
  Stock: number;
  Price: number;
}

export class BasketModel {
  Category1: string;
  Category2: string;
  Price: number;
  Count: number;
  Name: string;
  Id: number;
  Image: string;
}
