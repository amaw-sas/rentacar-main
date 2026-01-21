/**
 * Barrel export de composables
 *
 * Shared composables for business logic and utilities
 */

// SEO & Structured Data
export * from './useAggregateRating';
export * from './useBaseSEO';
export * from './useBreadcrumbs';
export * from './useLocalBusiness';
export * from './useProductSchema';
export * from './usePromotionSchema';
export * from './useVideoSchema';

// City-specific
export * from './useCityContent';
export * from './useCityFAQs';
export * from './useCityPageSEO';
export * from './useCityProductSchema';
export * from './useCityRelations';

// Search & Category
export * from './useCategory';
export * from './useSearch';
export * from './useSearchByRouteParams';
export * from './useSearchPageSEO';
export * from './useVehicleCategories';

// Data fetching
export * from './useData';
export * from './useFetchCategoriesAvailabilityData';
export * from './useFetchRentacarData';

// Forms & Utilities
export * from './useDefaultRouteParams';
export * from './useMessages';
export * from './useMoneyFormat';
export * from './usePhoneField';
export * from './useRecordReservationForm';
