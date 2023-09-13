import {
  useSearchActions,
  useSearchState,
  useSearchUtilities,
} from "@yext/search-headless-react";
import {
  SearchBar,
  StandardCard,
  UniversalResults,
  VerticalResults,
  onSearchFunc,
} from "@yext/search-ui-react";
import * as React from "react";
import { useState } from "react";
import SortDropdown from "./SortDropdown";
import ResultsCard from "./resultsCard";
type ResultProps = {
  vertKey?: string;
};
const Results = ({ vertKey }: ResultProps) => {
  const searchActions = useSearchActions();
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number | undefined>();
  const [resCount, setResCount] = useState<number | undefined>();
  const handleSearch: onSearchFunc = (searchEventData) => {
    const { query } = searchEventData;

    setLoading(true);
    vertKey ? searchActions.setVertical(vertKey) : searchActions.setUniversal();
    vertKey
      ? searchActions
          .executeVerticalQuery()
          .then((res) => {
            const reFetchCount = res?.verticalResults.resultsCount;
            const reFetchTime = res?.verticalResults.queryDurationMillis;
            setResCount(reFetchCount);
            setTime(reFetchTime);
          })
          .then(() => {
            console.log(time), setLoading(false);
          })
      : searchActions
          .executeUniversalQuery()
          .then((res) => {
            const reFetchCount = res?.verticalResults.reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.resultsCount,
              0
            );
            const reFetchTime = res?.verticalResults.reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.queryDurationMillis,
              0
            );
            setResCount(reFetchCount);
            setTime(reFetchTime);
          })
          .then(() => {
            console.log(time), setLoading(false);
          });
    const queryParams = new URLSearchParams(window.location.search);
    if (query) {
      queryParams.set("query", query);
    } else {
      queryParams.delete("query");
    }
    history.pushState(null, "", "?" + queryParams.toString());
  };
  return (
    <>
      <SearchBar onSearch={handleSearch}></SearchBar>
      {!loading ? (
        <>
          {resCount && (
            <div className="my-4 text-gray-500">
              Fetched {resCount} results in {time}ms
            </div>
          )}
          {vertKey ? (
            <div>
              <div className="flex justify-end">
                <SortDropdown></SortDropdown>
              </div>
              <VerticalResults CardComponent={ResultsCard} />
            </div>
          ) : (
            <UniversalResults verticalConfigMap={{}}></UniversalResults>
          )}
        </>
      ) : (
        <div>Loading results...</div>
      )}
    </>
  );
};

export default Results;
