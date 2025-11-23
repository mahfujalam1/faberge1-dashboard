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
  }),
});

export const { useGetAllMessagesQuery } = messageApi;
