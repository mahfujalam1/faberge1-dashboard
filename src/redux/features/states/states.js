import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const stateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllState: builder.query({
      query: () => ({
        url: `state/get-all-state`,
        method: "GET",
      }),
      providesTags: [tagTypes.states],
    }),
    activeState: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/state/update-state/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.states],
    }),
  }),
});

export const { useGetAllStateQuery, useActiveStateMutation } = stateApi;
