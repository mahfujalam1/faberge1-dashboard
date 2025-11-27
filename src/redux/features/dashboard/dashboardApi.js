import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatus: builder.query({
      query: () => ({
        url: "/admin/getTotalStatus",
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes,
    }),
    getIncomeRatio: builder.query({
      query: (year) => ({
        url: `/admin/getIncomeRatio?year=${year}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes,
    }),

    getUpcomingBookings: builder.query({
      query: () => ({
        url: `/booking/get-all-bookings?page=1&limit=5&status=booked&filterType=upcoming`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookings],
    }),
  }),
});

export const {
  useGetDashboardStatusQuery,
  useGetIncomeRatioQuery,
  useGetUpcomingBookingsQuery,
} = dashboardApi;
