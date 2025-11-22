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

    // getServiceById: builder.query({
    //   query: (id) => ({
    //     url: `/service/get-one-service/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: [tagTypes.services],
    // }),

    // updateService: builder.mutation({
    //   query: ({ id, data }) => {
    //     return {
    //       url: `/service/update-service/${id}`,
    //       method: "PATCH",
    //       body: data,
    //     };
    //   },
    //   invalidatesTags: [tagTypes.services],
    // }),

    // deleteService: builder.mutation({
    //   query: (id) => ({
    //     url: `/service/delete-service/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [tagTypes.services],
    // }),
  }),
});

export const { useGetAllBookingsQuery } = bookingApi;
