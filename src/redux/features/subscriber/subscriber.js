import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const subscriberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscribers: builder.query({
      query: ({ page, limit }) => ({
        url: `/subscriber/get-all-subscribers?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [tagTypes.notifications],
    }),

    updateSubscriberStatus: builder.mutation({
      query: (id) => ({
        url: `/subscriber/update-status-subscriber/${id}`,
        method: "GET",
      }),
      invalidatesTags: [tagTypes.notifications],
    }),

    deleteSubscriber: builder.mutation({
      query: (id) => ({
        url: `/subscriber/delete-subscriber/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.notifications],
    }),
  }),
});

export const {
  useGetAllSubscribersQuery,
  useUpdateSubscriberStatusMutation,
  useDeleteSubscriberMutation,
} = subscriberApi;
