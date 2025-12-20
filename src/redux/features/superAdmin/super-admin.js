import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const superAdmin = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllManagers: builder.query({
      query: (searchValue) => ({
        url: `/manager/get-all-managers?search=${searchValue}`,
        method: "GET",
      }),
      providesTags: [tagTypes.managers],
    }),
    getAllAccessibility: builder.query({
      query: () => ({
        url: `/accessibility/get-all-accessibility`,
        method: "GET",
      }),
      providesTags: [tagTypes.managers],
    }),
    createManager: builder.mutation({
      query: (newManagerData) => ({
        url: "/manager/register",
        method: "POST",
        body: newManagerData,
      }),
      invalidatesTags: [tagTypes.managers],
    }),
    updateManagerAccess: builder.mutation({
      query: ({ managerId, data }) => ({
        url: `/accessibility/update-status-accessibility/${managerId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.managers],
    }),
    blockManager: builder.mutation({
      query: (managerId) => ({
        url: `/manager/block-unblock/${managerId}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.managers],
    }),
  }),
});

export const {
  useGetAllManagersQuery,
  useGetAllAccessibilityQuery,
  useUpdateManagerAccessMutation,
  useCreateManagerMutation,
  useBlockManagerMutation,
} = superAdmin;
