import searchConfig from "./searchConfig";
import * as React from "react";
import {
  AppliedFilters,
  FilterSearch,
  Pagination,
  ResultsCount,
  SearchBar,
  StandardCard,
  StandardFacets,
  VerticalResults,
} from "@yext/search-ui-react";
import { useEffect, useState } from "react";
import { useSearchActions } from "@yext/search-headless-react";
import ProductCard from "./productCard";
const SearchBarHead = () => {
  const searchActions = useSearchActions();

  useEffect(() => {
    searchActions.setVertical("products");
  }, []);
  return (
    <>
      <div className="flex justify-center px-4 py-6">
        <div className="w-full max-w-7xl home">
          <SearchBar
            customCssClasses={{ searchBarContainer: "!rounded-none	" }}
            hideRecentSearches={true}
            placeholder="Find Locations Near You"
          />
          <div className="flex gap-16 pb-8">
            <StandardFacets
              customCssClasses={{
                standardFacetsContainer: "min-w-[200px]  hidden md:block",
              }}
            />
            <div className="flex-col">
              <ResultsCount   />
              <AppliedFilters
                customCssClasses={{
                  clearAllButton: "hidden",
                  appliedFiltersContainer: "pb-4",
                }}
              />
              <VerticalResults
                CardComponent={ProductCard}
                customCssClasses={{
                  verticalResultsContainer:
                    "grid grid-cols-1 md:grid-cols-3 md:gap-4 md:pb-4",
                }}
              />
              <Pagination />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBarHead;
