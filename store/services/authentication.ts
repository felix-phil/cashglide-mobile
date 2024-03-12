import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getEndpoint, { apiEndpoints } from "../../api/endpoints";
import { APIResponse, APIUser } from "../../api/types";
import { RootState } from "../index";

export const authenticationApi = createApi({
  reducerPath: "authentication",
  baseQuery: fetchBaseQuery({
    baseUrl: getEndpoint("", "authentication", "v1"),
    prepareHeaders: (headers, { getState, endpoint, ...others }) => {
      const token = (getState() as RootState).auth.token;
      if (token && endpoint !== "refresh") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    initialize: builder.mutation({
      query: (body: { primaryIdentifier: string }) => {
        return {
          url: apiEndpoints.authentication.INITIALIZE,
          method: "post",
          body: body,
        };
      },
      transformResponse: (
        response: APIResponse<{
          isNewUser: boolean;
          user: APIUser | null;
        }>
      ) => response.data,
    }),
    authenticateOrVerify: builder.mutation({
      query: (options: {
        reason: "authentication" | "verification";
        body: { identifier: string; otp: string };
      }) => {
        return {
          url:
            options.reason === "authentication"
              ? apiEndpoints.authentication.AUTHENTICATE
              : apiEndpoints.authentication.VERIFY,
          method: "post",
          body:
            options.reason === "authentication"
              ? {
                primaryIdentifier: options.body.identifier,
                otp: options.body.otp,
              }
              : options.body,
        };
      },
      transformResponse: (
        response: APIResponse<
          | {
            authToken: string;
            refreshToken: string;
            tokenExpiry: number;
            refreshTokenExpiry: number;
            user: APIUser;
          }
          | APIUser
        >
      ) => response.data,
    }),
    requestIdentifierVerify: builder.mutation({
      query: (body: { identifier: string }) => {
        return {
          url: apiEndpoints.authentication.REQUEST_VERIFY,
          method: "post",
          body: body,
        };
      },
      transformResponse: (
        response: APIResponse<{
          authToken: string;
          refreshToken: string;
          tokenExpiry: number;
          refreshTokenExpiry: string;
          user: APIUser;
        }>
      ) => response.data,
    }),
    currentUser: builder.query({
      query: () => ({
        method: "get",
        url: apiEndpoints.authentication.CURRENT_USER,
      }),
      transformResponse: (response: APIResponse<APIUser>) => response.data,
      providesTags: ["User"],
    }),
    verifyIdentifier: builder.mutation({
      query: (body: { identifier: string; otp: string }) => {
        return {
          url: apiEndpoints.authentication.VERIFY,
          method: "post",
          body: body,
        };
      },
      transformResponse: (
        response: APIResponse<{
          authToken: string;
          refreshToken: string;
          tokenExpiry: number;
          refreshTokenExpiry: string;
          user: APIUser;
        }>
      ) => response.data,
      invalidatesTags: ["User"],
    }),
    checkUsername: builder.mutation({
      query: (body: { username: string }) => {
        return {
          url: apiEndpoints.authentication.CHECK_USERNAME,
          method: "post",
          body: body,
        };
      },
      transformResponse: (response: APIResponse<any>) => response.data,
    }),
    updateUserProfile: builder.mutation({
      query: (body: { [key: string]: any } | FormData) => ({
        url: apiEndpoints.authentication.SECOND_STAGE,
        method: "patch",
        body,
        headers: {
          "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json"
        }
      }),
      transformResponse: (response: APIResponse<APIUser>) => response.data,
      invalidatesTags: ["User"],
    }),
    addBVN: builder.mutation({
      query: (body: { bvn: string }) => ({
        url: apiEndpoints.authentication.ADDBVN,
        method: "post",
        body,
      }),
      transformResponse: (response: APIResponse<any>) => response.data,
      invalidatesTags: ["User"],
    }),
    refreshAuthToken: builder.mutation({
      query: (body: { refreshToken: string; expiredToken: string }) => ({
        url: apiEndpoints.authentication.REFRESH_TOKEN,
        body: { refreshToken: body.refreshToken },
        method: "post",
        headers: {
          Authorization: "Bearer " + body.expiredToken,
        },
      }),
      transformResponse: (
        response: APIResponse<{
          authToken: string;
          refreshToken: string;
          tokenExpiry: number;
          refreshTokenExpiry: number;
          user: APIUser;
        }>
      ) => response.data,
    }),
    searchUser: builder.mutation({
      query: (body: { identifier: string; single?: boolean }) => ({
        url: apiEndpoints.authentication.SEARCH(body.identifier, body.single),
        method: "get",
      }),
      transformResponse: (response: APIResponse<APIUser | APIUser[]>) =>
        response.data,
    }),
    comparePIN: builder.mutation({
      query: (body: { pin: string }) => ({
        method: "post",
        url: apiEndpoints.authentication.COMPARE_PIN,
        body,
      }),
      transformResponse: (response: APIResponse<APIUser[]>) => response.data,
    }),
  }),
});
export const {
  useInitializeMutation,
  useAuthenticateOrVerifyMutation,
  useRequestIdentifierVerifyMutation,
  useCurrentUserQuery,
  useLazyCurrentUserQuery,
  useVerifyIdentifierMutation,
  useCheckUsernameMutation,
  useUpdateUserProfileMutation,
  useRefreshAuthTokenMutation,
  useAddBVNMutation,
  useSearchUserMutation,
  useComparePINMutation
} = authenticationApi;
