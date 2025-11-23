import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/public/get-privacy-policy",
        method: "GET",
      }),
      providesTags: [tagTypes.privacy],
    }),
    updatePrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: "/public/create-or-update-privacy-policy",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.privacy],
    }),
  }),
});

export const { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } =
  privacyApi;
