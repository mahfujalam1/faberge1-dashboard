import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const siteContent = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // about us
    getAboutUs: builder.query({
      query: () => ({
        url: "/public/get-about-us",
        method: "GET",
      }),
      providesTags: [tagTypes.siteContent],
    }),
    updateAboutUs: builder.mutation({
      query: (data) => ({
        url: "/public/create-or-update-about-us",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.siteContent],
    }),

    // service
    createService: builder.mutation({
      query: (data) => ({
        url: "/photo/create-dynamic-photo-or-video",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.siteContent],
    }),

    getDynamicBanner: builder.query({
      query: () => ({
        url: "/photo/get-all-dynamic-photo",
        method: "GET",
      }),
      providesTags: [tagTypes.siteContent],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
  useGetDynamicBannerQuery
} = siteContent;
