import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    servicePopularity: builder.query({
      query: ({ year, month }) => ({
        url: `/service/popularity?year=${year}&month=${month}`,
        method: "GET",
      }),
      providesTags: [tagTypes.analytics],
    }),

    workerPopularity: builder.query({
      query: ({ year, month }) => ({
        url: `/booking/popularity?year=${year}&month=${month}`,
        method: "GET",
      }),
      providesTags: [tagTypes.analytics],
    }),

    bookingThrends: builder.query({
      query: ({ year }) => ({
        url: `/booking/booking-trends?year=${year}`,
        method: "GET",
      }),
      providesTags: [tagTypes.analytics],
    }),

    bookingRevenue: builder.query({
      query: () => ({
        url: `/booking/get-monthly-revenue`,
        method: "GET",
      }),
      providesTags: [tagTypes.analytics],
    }),
  }),
});

export const {
  useServicePopularityQuery,
  useBookingThrendsQuery,
  useWorkerPopularityQuery,
  useBookingRevenueQuery
} = analyticsApi;
