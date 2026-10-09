import { apiSlice } from './apiSlice.js';

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: (params) => ({ url: '/vendors', params }),
      providesTags: ['Vendor'],
    }),
    getVendor: builder.query({
      query: (id) => `/vendors/${id}`,
      transformResponse: (res) => res.data,
      providesTags: ['Vendor'],
    }),
    getMyVendorProfile: builder.query({
      query: () => '/vendors/me/profile',
      transformResponse: (res) => res.data,
      providesTags: ['Vendor'],
    }),
    updateMyVendorProfile: builder.mutation({
      query: (body) => ({ url: '/vendors/me/profile', method: 'PUT', body }),
      invalidatesTags: ['Vendor'],
    }),
    getVendorEarnings: builder.query({
      query: () => '/vendors/me/earnings',
      transformResponse: (res) => res.data,
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorQuery,
  useGetMyVendorProfileQuery,
  useUpdateMyVendorProfileMutation,
  useGetVendorEarningsQuery,
} = vendorApi;
