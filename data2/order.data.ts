export enum OrderStatus {
  submitted = "SUBMITTED",
  approved = "APPROVED",
  dispatched = 'DISPATCHED',
  delivered = 'DELIVERD'
}

export interface ShippingDetails {
    city: string;
    state: string;
    country: string;
    pinCode: string;
    lastName: string;
    firstName: string;
    addressLine1: string;
    addressLine2: string;
  }