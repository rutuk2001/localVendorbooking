import { apiSlice } from './apiSlice.js';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard',
      transformResponse: (res) => res.data,
      providesTags: ['Admin'],
    }),
    listUsers: builder.query({
      query: (params) => ({ url: '/admin/users', params }),
      providesTags: ['Admin'],
    }),
    toggleUserActive: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}/toggle-active`, method: 'PUT' }),
      invalidatesTags: ['Admin'],
    }),
    listPendingVendors: builder.query({
      query: () => '/admin/vendors/pending',
      transformResponse: (res) => res.data,
      providesTags: ['Admin'],
    }),
    approveVendor: builder.mutation({
      query: (id) => ({ url: `/admin/vendors/${id}/approve`, method: 'PUT' }),
      invalidatesTags: ['Admin'],
    }),
    rejectVendor: builder.mutation({
      query: (id) => ({ url: `/admin/vendors/${id}/reject`, method: 'PUT' }),
      invalidatesTags: ['Admin'],
    }),
    listAllBookings: builder.query({
      query: (params) => ({ url: '/admin/bookings', params }),
      providesTags: ['Admin'],
    }),
    listComplaints: builder.query({
      query: () => '/admin/complaints',
      transformResponse: (res) => res.data,
      providesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useListUsersQuery,
  useToggleUserActiveMutation,
  useListPendingVendorsQuery,
  useApproveVendorMutation,
  useRejectVendorMutation,
  useListAllBookingsQuery,
  useListComplaintsQuery,
} = adminApi;
