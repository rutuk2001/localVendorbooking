import { apiSlice } from './apiSlice.js';

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (body) => ({ url: '/reviews', method: 'POST', body }),
      invalidatesTags: ['Review', 'Booking', 'Vendor'],
    }),
    getVendorReviews: builder.query({
      query: (vendorId) => `/reviews/vendor/${vendorId}`,
      transformResponse: (res) => res.data,
      providesTags: ['Review'],
    }),
  }),
});

export const { useCreateReviewMutation, useGetVendorReviewsQuery } = reviewApi;
