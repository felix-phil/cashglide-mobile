export interface APIResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}
export interface APIUser {
  primaryIdentifier: string;
  registrationCompleted: boolean;
  phone?: string;
  active: boolean;
  banned: boolean;
  deactivated: boolean;
  allVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  roleLevel: number;
  bvn?: boolean;
  pin?: boolean;
  dob?: string;
  gender?: "male" | "female";
  createdAt: string;
  updatedAt: string;
  email?: string;
  firstName?: string;
  address?: string;
  city?: string;
  country?: string;
  lastName?: string;
  otherName?: string;
  state?: string;
  pushToken?: string;
  username?: string;
  id: string;
  fullName?: string;
  profileImageUrl?: string;
}
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
export enum Services {
  Data = "data",
  Airtime = "airtime",
  Electricity = "electricity",
  Internet = "internet",
  Education = "education",
  Movies = "movies",
  TopUp = "topup",
  Transfer = "transfer",
  TransferToBank = "transfer_to_bank",
}
export enum Status {
  Initialized = "initialized",
  Pending = "pending",
  Success = "success",
}

export enum Currency {
  Nigeria = "ngn",
  Ghana = "ghs",
  Kenya = "kes",
  Tanzania = "tzs",
  Uganda = "ugx",
}
export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: "debit" | "credit";
  service: Services;
  amount: number;
  status: Status;
  currency: Currency;
  fromName?: string;
  fromNumber?: string;
  recipientName?: string;
  recipientNumber?: string;
  institutionName?: string;
  gatewayReference?: string;
  extraDetails?: string;
  createdAt: string;
  updatedAt: string;
}
export interface Account {
  userId: string | APIUser;
  accountName: string;
  accountNumber: string;
  accountBank: string;
  currency: Currency;
  accountId: string; // order reference from gateway
}
export interface Card {
  id: string;
  cardFullName: string;
  cardNumber: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardToken?: string;
  cardType?: string;
  completed?: boolean;
  transactionId?: string;
}
export interface Bank {
  id: number;
  code: string;
  name: string;
}