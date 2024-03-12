import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEndpoint, { apiEndpoints } from "../../api/endpoints";
import {
  APIResponse,
  APIUser,
  Account,
  Card,
  Transaction,
  Wallet,
} from "../../api/types";
import { RootState } from "../index";

export const cardApi = createApi({
  reducerPath: "card",
  baseQuery: fetchBaseQuery({
    baseUrl: getEndpoint("", "card", "v1"),
    prepareHeaders: (headers, { getState, endpoint, ...others }) => {
      const token = (getState() as RootState).auth.token;
      if (token && endpoint !== "refresh") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Cards"],
  endpoints: (builder) => ({
    getCards: builder.query({
      query: () => ({
        url: apiEndpoints.card.ALL_CARDS,
        method: "get",
      }),
      transformResponse: (response: APIResponse<Card[]>) => response.data,
      providesTags: ["Cards"],
    }),
    addCard: builder.mutation({
      query: (body: {
        amount: number;
        cardNumber: string;
        cardExpiryMonth: string;
        cardExpiryYear: string;
        cardCvv: string;
        cardFullName: string;
        chargeType: "AUTH" | "NONE";
        authMode?: string;
        authFields?: string[];
        authFieldValues?: { [key: string]: string };
      }) => ({
        method: "post",
        url: apiEndpoints.card.ADD_CARD,
        body,
      }),
      transformResponse: (
        response: APIResponse<{
          authRequired?: boolean;
          authMode?: string;
          authFields?: string[];
          completed?: boolean;
          pending?: boolean;
          redirect_uri?: string;
          transactionId?: string;
          validationRequired?: boolean;
          validationMode?: string;
          cardId?: string;
        }>
      ) => response.data,
    }),
    completeCardOTP: builder.mutation({
      query: (body: { cardId: string; otp: string }) => ({
        method: "post",
        url: apiEndpoints.card.COMPLETE_OTP,
        body,
      }),
      transformResponse: (
        response: APIResponse<{
          pending?: boolean;
          completed?: true;
          transactionId?: string;
        }>
      ) => response.data,
    }),
    topupWithCard: builder.mutation({
      query: (body: { pin: string; amount: number; cardId: string }) => ({
        method: "post",
        body,
        url: apiEndpoints.card.TOPUP_WITH_CARD,
      }),
      transformResponse: (response: APIResponse<Transaction>) => response.data,
    }),
  }),
});
export const {
  useGetCardsQuery,
  useAddCardMutation,
  useCompleteCardOTPMutation,
  useTopupWithCardMutation,
} = cardApi;
