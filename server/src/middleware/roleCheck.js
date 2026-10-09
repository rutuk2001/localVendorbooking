// Convenience wrappers around authorize() for readability in route files.
import { authorize } from './auth.js';

export const isAdmin = authorize('ADMIN');
export const isVendor = authorize('VENDOR');
export const isCustomer = authorize('CUSTOMER');
export const isVendorOrAdmin = authorize('VENDOR', 'ADMIN');
