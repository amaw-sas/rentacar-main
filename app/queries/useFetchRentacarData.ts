import { useQuery, defineQuery } from "@pinia/colada";
/** types */
import type { CategoryData, BranchData, PageConfigData, ReservasApiData } from "#imports";

export const useFetchRentacarData = defineQuery(() => {
    const config = useRuntimeConfig();
    const endpoint = config.public.rentacarApiReservasDataEndpoint;
    const categories = ref<CategoryData[] | null | undefined>(null);
    const page_config = ref<PageConfigData | null | undefined>(null);
    const branches = ref<BranchData[] | null | undefined>(null);

    const { isPending: pending, isLoading: loading } = useQuery<ReservasApiData>({
        key: ["reservasApiData"],
        query: async () => {
            const rawData = await $fetch<ReservasApiData>(endpoint, {
                method: "POST",
                body: {
                    franchise: config.public.rentacarFranchise,
                },
            });
            // Deep-clone to ensure POJO serialization
            const data = JSON.parse(JSON.stringify(rawData));
            // Update refs with the cloned data
            categories.value = data.categories;
            branches.value = data.branches;
            page_config.value = data.page_config;
            return data;
        }
    });

    return {
        categories,
        branches,
        page_config,
        pending,
        loading,
    }
    
});