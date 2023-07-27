import { useSearchActions, useSearchState } from "@yext/search-headless-react";
import { SearchBar, UniversalResults } from "@yext/search-ui-react";
import * as React from "react";
import { useState } from "react";

const Results = () => {
  const searchActions = useSearchActions();
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number | undefined>();
  const [resCount, setResCount] = useState<number | undefined>();
  const handleSearch = () => {
    setLoading(true);
    searchActions.setUniversal();
    searchActions
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
  };
  return (
    <>
      <SearchBar onSearch={handleSearch}></SearchBar>
      {!loading ? (
        <>
          {resCount && time && (
            <div className="my-4 text-gray-500">
              Fetched {resCount} results in {time}ms
            </div>
          )}
          <UniversalResults verticalConfigMap={{}}></UniversalResults>
        </>
      ) : (
        <div>Loading results...</div>
      )}
    </>
  );
};

export default Results;
