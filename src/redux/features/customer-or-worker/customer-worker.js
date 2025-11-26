import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const customerOrWorker = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    toggleBlockUnblock: builder.mutation({
      query: (id) => ({
        url: `/customer-or-worker/update-block-unblock/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.workers, tagTypes.users],
    }),
  }),
});

export const { useToggleBlockUnblockMutation } = customerOrWorker;
