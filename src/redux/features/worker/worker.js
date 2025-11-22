import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const workerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllWorkers: builder.query({
      query: () => ({
        url: "/worker/get-all-worker",
        method: "GET",
      }),
      providesTags: [tagTypes.workers],
    }),
    deleteWorker: builder.mutation({
      query: (data) => ({
        url: "/manager/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.workers],
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
  useDeleteWorkerMutation,
  useCreateWorkerMutation,
} = workerApi;
