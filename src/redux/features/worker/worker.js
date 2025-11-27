import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const workerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllWorkers: builder.query({
      query: ({ page, limit, searchTerm }) => ({
        url: `/worker/get-all-worker?page=${page}&limit=${limit}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: [tagTypes.workers],
    }),
    getSingleWorker: builder.query({
      query: (id) => ({
        url: `/worker/get-one-worker/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.workers],
    }),
    createWorker: builder.mutation({
      query: (data) => ({
        url: "/worker/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.workers],
    }),
  }),
});

export const {
  useGetAllWorkersQuery,
  useGetSingleWorkerQuery,
  useCreateWorkerMutation,
} = workerApi;
