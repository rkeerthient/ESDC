import {
  UniversalLimit,
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
  const universalLimit: UniversalLimit = {
    pages: 10,
    pages_french: 10,
    document: 10,
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const d1 = new Date();

      if (vertKey) {
        searchActions.setVertical(vertKey);
        searchActions.setQuery("");
        try {
          const res = await searchActions.executeVerticalQuery();
          const d2 = new Date();
          const reFetchCount = res?.verticalResults.resultsCount;
          const reFetchTime: number = d2.getTime() - d1.getTime();

          setResCount(reFetchCount);
          setTime(reFetchTime);
        } catch (error) {
          console.error("Error fetching vertical query:", error);
        }
      } else {
        searchActions.setUniversalLimit(universalLimit);
        searchActions.setUniversal();
        searchActions.setQuery("statement");
        try {
          const res = await searchActions.executeUniversalQuery();
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
        } catch (error) {
          console.error("Error fetching universal query:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [vertKey, searchActions]);

  const handleSearch: onSearchFunc = (searchEventData) => {
    const { query } = searchEventData;
    const d1 = new Date();

    setLoading(true);
    vertKey ? searchActions.setVertical(vertKey) : searchActions.setUniversal();
    vertKey
      ? searchActions
          .executeVerticalQuery()
          .then((res) => {
            const d2 = new Date();
            const reFetchCount = res?.verticalResults.resultsCount;
            const reFetchTime: number = d2.getTime() - d1.getTime();
            setResCount(reFetchCount);
            setTime(reFetchTime);
          })
          .then(() => {
            console.log(time), setLoading(false);
          })
      : (searchActions.setUniversalLimit(universalLimit),
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
          }));

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
          {resCount && resCount !== 0 && (
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
            <UniversalResults
              verticalConfigMap={{
                pages: {
                  label: "Pages English",
                  CardComponent: ResultsCard,
                },
                pages_french: {
                  label: "Pages French",
                  CardComponent: ResultsCard,
                },
                document: {
                  label: "Documents",
                  CardComponent: ResultsCard,
                },
              }}
            ></UniversalResults>
          )}
        </>
      ) : (
        <div>Loading results...</div>
      )}
    </>
  );
};

export default Results;
