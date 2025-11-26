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
      providesTags:[tagTypes.users]
    }),
  }),
});

export const { useGetAllUsersQuery } = userApi;
