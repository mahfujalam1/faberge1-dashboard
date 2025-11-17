import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (data) => {
        return {
          url: "service/create-service",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.services],
    }),

    getAllServices: builder.query({
      query: ({ page, limit, sortBy }) => ({
        url: `service/get-all-services?page=${page}&limit=${limit}&sortOrder=${sortBy}`,
        method: "GET",
      }),
      providesTags: [tagTypes.services],
    }),

    getServiceById: builder.query({
      query: (id) => ({
        url: `/service/get-one-service/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.services],
    }),

    updateService: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/service/update-service/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.services],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service/delete-service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.services],
    }),
  }),
});

export const {
  useAddServiceMutation,
  useDeleteServiceMutation,
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} = serviceApi;
