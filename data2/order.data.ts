export enum OrderStatus {
  submitted = 'SUBMITTED',
  approved = 'APPROVED',
  inTransit = 'IN_TRANSIT',
  delivered = 'DELIVERED',
  cancelled = 'CANCELLED'
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