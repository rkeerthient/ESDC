import { CardProps } from "@yext/search-ui-react";
import * as React from "react";
import { useEffect, useState } from "react";

import RTF from "./RTF";

const ResultsCard = (props: CardProps<any>): JSX.Element => {
  const { result } = props;
  const [isActive, setIsActive] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [cat, setCat] = useState<string[]>([]);
  const currText = result.rawData.body
    ? result.rawData.body
    : result.rawData.richTextDescription;
  const [resText, setResText] = useState(currText);

  const updateReadMoreContent = () => {
    setReadMore(!readMore);
    readMore ? setResText(currText.slice(0, 500)) : setResText(currText);
  };
  useEffect(() => {
    result.rawData.c_subdirectory1 &&
      cat.push(result.rawData.c_subdirectory1.toString());
    result.rawData.c_subdirectory2 &&
      cat.push(result.rawData.c_subdirectory2.toString());
    result.rawData.c_dateAndPlace
      ? cat.push(result.rawData.c_dateAndPlace.toString())
      : cat.push(result.rawData.datePosted.toString());
    setCat(cat);
    setResText(currText.slice(0, 500));
  }, []);
  console.log(cat);
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div className="w-full  my-4 border   p-4 ">
      <div>
        <div onClick={() => setIsActive(!isActive)}>
          <div>
            <div>
              <div className="w-full break-before-auto text-[#284162] hover:cursor-pointer text-lg">
                {result.name}
              </div>
              <div className="text-green-600 my-2">
                {new URL(result.rawData.landingPageUrl).protocol +
                  "//" +
                  new URL(result.rawData.landingPageUrl).host +
                  " > " +
                  capitalizeFirstLetter(
                    new URL(result.rawData.landingPageUrl).host
                  )}
              </div>
              <div className="flex text-gray-400 text-sm">
                {cat.map((item: string, index: number) => (
                  <div className="flex  " key={index}>
                    <div>{item}</div>
                    {cat.length - 1 !== index && (
                      <div className="!mx-1">{">"}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className=" text-base flex justify-between">
          <div className="w-3/4 !font-light">
            <RTF>{resText}</RTF>
            <div
              onClick={() => updateReadMoreContent()}
              className="italic mt-8"
            >
              {readMore ? "Show less >" : "Show more >"}
            </div>
          </div>
          <a href={result.rawData.landingPageUrl} className="mr-20 ">
            <div className="bg-[#284162] text-white uppercase px-6 py-2 w-fit rounded-full">
              Visit page
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
