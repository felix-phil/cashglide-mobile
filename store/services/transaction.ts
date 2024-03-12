import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEndpoint, { apiEndpoints } from "../../api/endpoints";
import {
  APIResponse,
  APIUser,
  Account,
  Transaction,
  Wallet,
} from "../../api/types";
import { RootState } from "../index";

export const transactionApi = createApi({
  reducerPath: "transaction",
  baseQuery: fetchBaseQuery({
    baseUrl: getEndpoint("", "transactions", "v1"),
    prepareHeaders: (headers, { getState, endpoint, ...others }) => {
      const token = (getState() as RootState).auth.token;
      if (token && endpoint !== "refresh") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Transactions", "Transaction"],
  endpoints: (builder) => ({
    getTransacctions: builder.query({
      query: () => ({
        url: apiEndpoints.transactions.ALL_TRANSACTIONS,
        method: "get",
      }),
      providesTags: ["Transactions"],
      transformResponse: (
        response: APIResponse<{
          transactions: Transaction[];
        }>
      ) => response.data,
    }),
    getSingleTransaction: builder.query({
      query: (transactionId: string) => ({
        url: apiEndpoints.transactions.SINGLE_TRANSACTION(transactionId),
        method: "get",
      }),
      transformResponse: (respose: APIResponse<Transaction>) => respose.data,
    }),
  }),
});
export const { useGetTransacctionsQuery, useGetSingleTransactionQuery } = transactionApi;
