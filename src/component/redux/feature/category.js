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

    updatecategory_gallery: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/category/gallery/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    getcategory_notice: builder.query({
      query: () => ({
        url: "/api/category/notice",
        method: "GET",
      }),
      transformResponse: (response) => {
        return Array.isArray(response)
          ? response
          : response.data || response.category || [];
      },
      providesTags: ["category"],
    }),
    createcategory_notice: builder.mutation({
      query: (data) => ({
        url: "/api/category/notice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    deletecategory_notice: builder.mutation({
      query: (id) => ({
        url: `/api/category/notice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
    get_vacancy_category: builder.query({
      query: () => ({
        url: "/api/category/vacancy",
        method: "GET",
      }),
      transformResponse: (response) => {
        return Array.isArray(response)
          ? response
          : response.data || response.category || [];
      },
      providesTags: ["category"],
    }),
    createcategory_vacancy: builder.mutation({
      query: (data) => ({
        url: "/api/category/vacancy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    deletecategory_vacancy: builder.mutation({
      query: (id) => ({
        url: `/api/category/vacancy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
    updatecategory_vacancy: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/category/vacancy/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    getblog_category: builder.query({
      query: (data) => ({
        url: "/api/category/blog",
        method: "GET",
        body: data,
      }),

      providesTags: ["category"],
    }),
    create_blogs_category: builder.mutation({
      query: (data) => ({
        url: "/api/category/blog",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    update_blogs_category: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/category/blog/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    delete_blogs_category: builder.mutation({
      query: (id) => ({
        url: `/api/category/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
    get_team_category: builder.query({
      query: (data) => ({
        url: "/api/category/team",
        method: "GET",
        body: data,
      }),
      providesTags: ["category"],
    }),
    create_team_category: builder.mutation({
      query: (data) => ({
        url: "/api/category/team",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
    delete_team_category: builder.mutation({
      query: (id) => ({
        url: `/api/category/team/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
    update_team_category: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/category/team/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),
  }),
});
export const {
  useDeletecategory_galleryMutation,
  useCreatecategory_galleryMutation,
  useGetcategory_galleryQuery,
  useUpdatecategory_galleryMutation,
  useCreatecategory_noticeMutation,
  useGetcategory_noticeQuery,
  useDeletecategory_noticeMutation,
  useGet_vacancy_categoryQuery,
  useCreatecategory_vacancyMutation,
  useDeletecategory_vacancyMutation,
  useUpdatecategory_vacancyMutation,
  useCreate_blogs_categoryMutation,
  useGetblog_categoryQuery,
  useUpdate_blogs_categoryMutation,
  useDelete_blogs_categoryMutation,
  useCreate_team_categoryMutation,
  useGet_team_categoryQuery,
  useDelete_team_categoryMutation,
  useUpdate_team_categoryMutation,
} = categoryApi;
