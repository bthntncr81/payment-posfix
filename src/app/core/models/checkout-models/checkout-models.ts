export class CheckoutModel {
  basketJsonDetail: string
  shoppingUserId: number
  cardNumber: string
  phone: string
  mail: string
  orderGuid: string
  totalPrice: number
  iyzicoTransactionId: string
  orderDate: string
  orderNote: string
  status: number
  addressId: number
  address: {
    name: string
    city: string
    district: string
    openAddress: string
    shoppingOrderId: number
    shoppingUserId: number
  }
}
