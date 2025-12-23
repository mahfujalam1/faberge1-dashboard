import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({ page, limit, sortBy, searchTerm }) => {
        return {
          url: `/customer/get-all-customers?page=${page}&limit=${limit}&sortOrder=${sortBy}&search=${searchTerm}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.users],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/customer/customer-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.users],
    }),

    updateCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/customer/update-profile/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.users],
    }),
  }),
});

export const { useGetAllUsersQuery, useDeleteUserMutation, useUpdateCustomerMutation } = userApi;
