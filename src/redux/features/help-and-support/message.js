import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMessages: builder.query({
      query: () => ({
        url: "/public/get-contact-us",
        method: "GET",
      }),
      providesTags: [tagTypes.helpSupport],
    }),
    deleteContactUs: builder.mutation({
      query: (id) => ({
        url: `/public/delete-contact-us/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.helpSupport],
    }),
  }),
});

export const { useGetAllMessagesQuery, useDeleteContactUsMutation } = messageApi;
