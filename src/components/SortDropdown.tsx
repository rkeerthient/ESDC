import {
  Direction,
  SortBy,
  SortType,
  useSearchActions,
  useSearchState,
} from "@yext/search-headless-react";
import * as React from "react";
import { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

// object that has a label for the different sort types
const sortByOptions: { label: string; sortBy: SortBy }[] = [
  {
    label: "Name: A-Z",
    sortBy: {
      field: "name",
      direction: Direction.Ascending,
      type: SortType.Field,
    },
  },
  {
    label: "Name: Z-A",
    sortBy: {
      field: "name",
      direction: Direction.Descending,
      type: SortType.Field,
    },
  },
  {
    label: "Date: New-Old",
    sortBy: {
      field: "datePosted",
      direction: Direction.Ascending,
      type: SortType.Field,
    },
  },
  {
    label: "Date: Old-New",
    sortBy: {
      field: "datePosted",
      direction: Direction.Descending,
      type: SortType.Field,
    },
  },
];

const SortDropdown = (): JSX.Element | null => {
  // used to manage dropdown open/close state
  const [open, setOpen] = useState(false);

  // sortBys contains all the sortBy options that are in the search state
  const sortBys = useSearchState((state) => state.vertical.sortBys);
  // checking both result counts as <VerticalResults /> will show allResultsForVertical if there are no results for query
  const resultsCount =
    useSearchState(
      (state) =>
        state.vertical.resultsCount ||
        state.vertical.noResults?.allResultsForVertical.resultsCount
    ) ?? 0;

  const searchActions = useSearchActions();

  // selectedSort is the currently selected sortBy option
  const selectedSort = sortByOptions.find(
    (s) =>
      s.sortBy.field === sortBys?.[0]?.field &&
      s.sortBy.direction === sortBys?.[0]?.direction
  );

  // this function will set the sortBys in the search state, execute the search, and close the drawer
  const handleTileClick = (sortBy: SortBy) => {
    searchActions.setSortBys([sortBy]);
    searchActions.executeVerticalQuery();
    setOpen(false);
  };

  return resultsCount ? (
    <div className="relative text-sm">
      <div className="flex h-10 w-48 items-center justify-between border px-2">
        <div className="text-sm">
          <div className="font-semibold">Sort By:</div>
          <div>{selectedSort?.label}</div>
        </div>
        <button onClick={() => setOpen(!open)}>
          {open ? <BiChevronUp /> : <BiChevronDown />}
        </button>
      </div>
      <ul className="absolute border">
        {open &&
          sortByOptions
            // filtering out the selected sort option from the dropdown
            .filter((s) => s.sortBy !== selectedSort?.sortBy)
            .map((s) => (
              // when a sort option is clicked, call handleTileClick
              <li onClick={() => handleTileClick(s.sortBy)}>
                <div className="flex h-10 w-48 items-center px-2 bg-white hover:bg-gray-300">
                  {s.label}
                </div>
              </li>
            ))}
      </ul>
    </div>
  ) : null;
};

export default SortDropdown;
