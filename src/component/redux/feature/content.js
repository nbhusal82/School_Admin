import { indexSlice } from "./indexslice";

export const contentApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    getgallery: builder.query({
      query: () => ({
        url: "/api/content/gallery  ",
        method: "GET",
      }),

      transformResponse: (response) => {
        return Array.isArray(response)
          ? response
          : response.data || response.event || [];
      },
      providesTags: ["content"],
    }),

    creategallery: builder.mutation({
      query: (data) => ({
        url: "/api/content/gallery  ",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),

    updategallery: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/content/gallery/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),

    deletegallery: builder.mutation({
      query: (id) => ({
        url: `/api/content/gallery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["content"],
    }),
  }),
});
export const {
  useCreategalleryMutation,
  useGetgalleryQuery,
  useUpdategalleryMutation,
  useDeletegalleryMutation,
} = contentApi;
