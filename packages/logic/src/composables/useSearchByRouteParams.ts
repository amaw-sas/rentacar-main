// External dependencies
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

// Internal dependencies - stores
import useStoreReservationForm from '../stores/useStoreReservationForm';
import useStoreAdminData from '../stores/useStoreAdminData';

// Internal dependencies - composables
import useSearch from './useSearch';

export default function useSearchByRouteParams() {
  const route = useRoute();

  // Move all store access inside onMounted to prevent Pinia SSR errors
  onMounted(() => {
    // stores
    const storeForm = useStoreReservationForm();
    const storeAdminData = useStoreAdminData();

    // refs
    const {
      lugarRecogida,
      lugarDevolucion,
      fechaRecogida,
      fechaDevolucion,
      horaRecogida,
      horaDevolucion,
    } = storeToRefs(storeForm);

    // Convert slugs from route params to branch codes
    const slugRecogida = route.params.lugar_recogida?.toString();
    const slugDevolucion = route.params.lugar_devolucion?.toString();

    const branchRecogida = storeAdminData.searchBranchBySlug(slugRecogida ?? '');
    const branchDevolucion = storeAdminData.searchBranchBySlug(slugDevolucion ?? '');

    // Set values from route params
    lugarRecogida.value = branchRecogida?.code ?? null;
    lugarDevolucion.value = branchDevolucion?.code ?? null;
    fechaRecogida.value = route.params.fecha_recogida as string;
    fechaDevolucion.value = route.params.fecha_devolucion as string;
    horaRecogida.value = route.params.hora_recogida as string;
    horaDevolucion.value = route.params.hora_devolucion as string;

    // functions
    const { doSearch } = useSearch();

    // Perform search after setting params
    doSearch();
  });
}