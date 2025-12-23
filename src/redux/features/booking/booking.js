import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: ({ page, limit, status }) => ({
        url: `/booking/get-all-bookings?page=${page}&limit=${limit}&status=${status}`,
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

    getBookingsTrends: builder.query({
      query: (year) => ({
        url: `/booking/booking-trends?year=${year}`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookings],
    }),

    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/booking/delete-booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.bookings],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/booking/delete-transaction/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.bookings],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetAllTransactionsQuery,
  useGetBookingsTrendsQuery,
  useDeleteBookingMutation,
  useDeleteTransactionMutation,
} = bookingApi;
