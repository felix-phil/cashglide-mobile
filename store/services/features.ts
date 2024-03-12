import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEndpoint, { apiEndpoints } from "../../api/endpoints";
import { APIResponse, APIUser, Bank } from "../../api/types";
import { RootState } from "../index";

export const featuresApi = createApi({
  reducerPath: "contacts",
  baseQuery: fetchBaseQuery({
    baseUrl: getEndpoint("", "features", "v1"),
    prepareHeaders: (headers, { getState, endpoint, ...others }) => {
      const token = (getState() as RootState).auth.token;
      if (token && endpoint !== "refresh") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Contacts", "RecentUsers", "Banks"],
  endpoints: (builder) => ({
    syncContacts: builder.query({
      query: (body?: { contacts?: string[]; sync?: boolean }) => ({
        url: apiEndpoints.features.SYNC_CONTACTS,
        method: "post",
        body,
      }),
      transformResponse: (response: APIResponse<APIUser[]>) => response.data,
      providesTags: ["Contacts"],
    }),
    recentInTransferUsers: builder.query({
      query: () => ({
        method: "get",
        url: apiEndpoints.features.RECENT_IN_TRANSFER_USERS,
      }),
      transformResponse: (response: APIResponse<APIUser[]>) => response.data,
    }),
    bankList: builder.query({
      query: () => ({
        method: "get",
        url: apiEndpoints.features.BANKS_LIST,
      }),
      transformResponse: (response: APIResponse<Bank[]>) => response.data,
      providesTags: ["Banks"],
    }),
    getAccountDetails: builder.mutation({
      query: (body: { accountNumber: string; bankCode: string }) => ({
        method: "post",
        body,
        url: apiEndpoints.features.VERIFY_ACCOUNT,
      }),
      transformResponse: (
        response: APIResponse<{
          accountNumber: string;
          accountName: string;
        }>
      ) => response.data,
    }),
    getTransferFee: builder.mutation({
      query: (body: { amount:number }) => ({
        method: "post",
        body,
        url: apiEndpoints.features.TRANSFER_FEE,
      }),
      transformResponse: (
        response: APIResponse<number>
      ) => response.data,
    }),
  }),
});
export const {
  useLazySyncContactsQuery,
  useRecentInTransferUsersQuery,
  useBankListQuery,
  useLazyBankListQuery,
  useGetTransferFeeMutation,
  useGetAccountDetailsMutation
} = featuresApi;
