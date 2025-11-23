import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsCondition: builder.query({
      query: () => ({
        url: "/public/get-terms-and-conditions",
        method: "GET",
      }),
      providesTags: [tagTypes.termsCondition],
    }),
    updateTermsCondition: builder.mutation({
      query: (data) => ({
        url: "/public/create-or-update-terms-and-conditions",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.termsCondition],
    }),
  }),
});

export const { useGetTermsConditionQuery, useUpdateTermsConditionMutation } =
  termsApi;
