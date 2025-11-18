import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => ({
        url: "/manager/me",
        method: "GET",
      }),
      providesTags: [tagTypes.users],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/manager/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.users],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/manager/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.users],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
} = profileApi;
