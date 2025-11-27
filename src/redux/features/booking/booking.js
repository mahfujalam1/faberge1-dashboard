import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: ({ page, limit, status }) => ({
        url: `booking/get-all-bookings?page=${page}&limit=${limit}&status=${status}`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookings],
    }),

    getAllTransactions: builder.query({
      query: () => ({
        url: `/booking/get-all-transactions`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookings],
    }),
  }),
});

export const { useGetAllBookingsQuery, useGetAllTransactionsQuery } = bookingApi;
