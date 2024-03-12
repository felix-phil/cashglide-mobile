export const transactions = [
  {
    type: "airtime",
    date: new Date().toISOString(),
    amount: 1000,
    id: 1,
    transactionType: "debit",
  },
  {
    type: "electricity",
    date: new Date().toISOString(),
    amount: 2000,
    id: 2,
    transactionType: "debit",
  },
  {
    type: "topup",
    date: new Date().toISOString(),
    amount: 10000,
    id: 3,
    transactionType: "credit",
  },
  {
    type: "data",
    date: new Date().toISOString(),
    amount: 500,
    id: 4,
    transactionType: "debit",
  },
];
