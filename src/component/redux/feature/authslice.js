import { indexSlice } from "./indexslice";

export const authApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      }),
      providesTags: ["auth"],
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: "/api/auth/signout",
        method: "POST",
        body: data,
      }),
      providesTags: ["auth"],
    }),
  }),
});
export const { useLoginMutation, useLogoutMutation } = authApi;
