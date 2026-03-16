import { indexSlice } from "./indexslice";

export const categoryApi = indexSlice.injectEndpoints({
  endpoints: (builder) => ({
    getcategory_gallery: builder.query({
      query: () => ({
        url: "/api/category/gallery",
        method: "GET",
      }),
      transformResponse: (response) => {
        return Array.isArray(response)
          ? response
          : response.data || response.category || [];
      },
      providesTags: ["category"],
    }),
    createcategory_gallery: builder.mutation({
      query: (data) => ({
        url: "/api/category/gallery",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    deletecategory_gallery: builder.mutation({
      query: (id) => ({
        url: `/api/category/gallery/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});
export const {
  useDeletecategory_galleryMutation,
  useCreatecategory_galleryMutation,
  useGetcategory_galleryQuery,
} = categoryApi;
useGetcategory_galleryQuery;
