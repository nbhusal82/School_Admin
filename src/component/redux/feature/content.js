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
    getNotice: builder.query({
      query: () => ({
        url: "/api/content/notice",
        method: "GET",
      }),
      transformResponse: (response) => {
        return Array.isArray(response)
          ? response
          : response.data || response.event || [];
      },
      providesTags: ["content"],
    }),
    createNotice: builder.mutation({
      query: (data) => ({
        url: "/api/content/notice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),
    deleteNotice: builder.mutation({
      query: (id) => ({
        url: `/api/content/notice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["content"],
    }),
    getvacancy: builder.query({
      query: () => ({
        url: "/api/content/vacancy",
        method: "GET",
      }),
      transformResponse: (response) => {
        return Array.isArray(response)
          ? response
          : response.data || response.event || [];
      },
      providesTags: ["content"],
    }),
    createvacancy: builder.mutation({
      query: (data) => ({
        url: "/api/content/vacancy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),
    deletevacancy: builder.mutation({
      query: (id) => ({
        url: `/api/content/vacancy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["content"],
    }),
    updatevacancy: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/content/vacancy/${id}`,
        method: "PUT",
        body: data,
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
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useGetNoticeQuery,
  useCreatevacancyMutation,
  useGetvacancyQuery,
  useUpdatevacancyMutation,
  useDeletevacancyMutation,
} = contentApi;
