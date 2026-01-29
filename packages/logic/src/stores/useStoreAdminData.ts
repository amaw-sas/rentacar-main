// External dependencies
import { defineStore } from 'pinia';
import { computed } from 'vue';

// Internal dependencies - composables
import useFetchRentacarData from '../composables/useFetchRentacarData';

// Internal dependencies - utils
import { slugify } from '../utils/slugify';

// Types
import type { BranchData } from '@rentacar-main/logic/utils';

const useStoreAdminData = defineStore("storeAdminData", () => {
  const { categories, branches } = useFetchRentacarData();

  const sortedBranches = computed<BranchData[] | []>(() =>
    branches
      ? [...branches]
          .map(branch => ({
            ...branch,
            slug: slugify(branch.name)
          }))
          .sort((a: BranchData, b: BranchData) =>
            a.name.localeCompare(b.name)
          )
      : []
  );

  function searchBranchByCity(city: string | string[]): BranchData | undefined {
    return sortedBranches.value.find(
      (branch: BranchData) => branch.city == city
    );
  }

  function searchBranchByCode(branch_code: string): BranchData | undefined {
    return sortedBranches.value.find(
      (branch: BranchData) => branch.code == branch_code
    );
  }
  
  function isBranchCode(branch_code: string): boolean {
    const branch = searchBranchByCode(branch_code);
    return (branch) ? true : false;
  }

  function searchBranchBySlug(slug: string): BranchData | undefined {
    return sortedBranches.value.find(
      (branch: BranchData) => slugify(branch.name) === slug
    );
  }

  function isBranchSlug(slug: string): boolean {
    return searchBranchBySlug(slug) !== undefined;
  }

  return {
    categories,
    branches,
    sortedBranches,
    searchBranchByCity,
    searchBranchByCode,
    isBranchCode,
    searchBranchBySlug,
    isBranchSlug,
  };
});

export default useStoreAdminData;