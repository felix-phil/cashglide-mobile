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

export const walletApi = createApi({
  reducerPath: "wallet",
  baseQuery: fetchBaseQuery({
    baseUrl: getEndpoint("", "wallet", "v1"),
    prepareHeaders: (headers, { getState, endpoint, ...others }) => {
      const token = (getState() as RootState).auth.token;
      if (token && endpoint !== "refresh") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Wallet"],
  endpoints: (builder) => ({
    getWallet: builder.query({
      query: () => ({
        url: apiEndpoints.wallet.WALLET_DETAIL,
        method: "get",
      }),
      transformResponse: (
        response: APIResponse<{
          wallet: Wallet;
          recentTransaction: Transaction[];
          account: Account;
        }>
      ) => response.data,
      providesTags: ["Wallet"],
    }),
    sendToCashGlideUser: builder.mutation({
      query: (body: {
        amount: number;
        narration?: string;
        pin: string;
        recipientId: string;
      }) => ({
        url: apiEndpoints.wallet.IN_TRANSFER,
        body,
        method: "post",
      }),
      transformResponse: (response: APIResponse<Transaction>) => response.data,
      invalidatesTags: ["Wallet"],
    }),
    sendToBank: builder.mutation({
      query: (body: {
        accountNumber: string;
        bankCode: string;
        amount: number;
        narration?: string;
        pin: string;
      }) => ({
        url: apiEndpoints.wallet.BANK_TRANSFER,
        body,
        method: "post",
      }),
      transformResponse: (response: APIResponse<Transaction>) => response.data,
      invalidatesTags: ["Wallet"],
    }),
  }),
});
export const {
  useGetWalletQuery,
  useSendToCashGlideUserMutation,
  useSendToBankMutation,
} = walletApi;
