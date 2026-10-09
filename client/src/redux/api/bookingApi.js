import { apiSlice } from './apiSlice.js';

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (body) => ({ url: '/bookings', method: 'POST', body }),
      invalidatesTags: ['Booking'],
    }),
    getMyBookings: builder.query({
      query: (params) => ({ url: '/bookings/mine', params }),
      transformResponse: (res) => res.data,
      providesTags: ['Booking'],
    }),
    getVendorBookings: builder.query({
      query: (params) => ({ url: '/bookings/vendor', params }),
      transformResponse: (res) => res.data,
      providesTags: ['Booking'],
    }),
    getBookingById: builder.query({
      query: (id) => `/bookings/${id}`,
      transformResponse: (res) => res.data,
      providesTags: ['Booking'],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/bookings/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Booking'],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({ url: `/bookings/${id}/cancel`, method: 'PUT' }),
      invalidatesTags: ['Booking'],
    }),
    rescheduleBooking: builder.mutation({
      query: ({ id, scheduledDate }) => ({ url: `/bookings/${id}/reschedule`, method: 'PUT', body: { scheduledDate } }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetVendorBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useRescheduleBookingMutation,
} = bookingApi;
