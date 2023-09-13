import * as React from "react";
import Cta from "../components/cta";

type Link = {
  label: string;
  url: string;
};

const links: Link[] = [
  {
    label: "Home",
    url: "/",
  },
  {
    label: "Pages-en",
    url: "pages_en.html",
  },
  {
    label: "Pages-fr",
    url: "pages_fr.html",
  },
  {
    label: "Documents",
    url: "documents.html",
  },
];

const Header = () => {
  const linkDoms = links.map((link) => (
    <div key={link.label}>
      <a
        href={link.url}
        rel="noreferrer"
        className="text-[#284162] underline hover:text-[#0535d2]"
      >
        {link.label}
      </a>
    </div>
  ));

  return (
    <div className="border-b-4 border-[#284162]">
      <div className="mx-auto px-5 md:px-14 max-w-screen-2xl">
        <nav className="py-6 flex items-center justify-between">
          <img
            src="https://i.imgur.com/wkdYmtr.png"
            width="350"
            height="350"
          ></img>
          <div className="flex gap-x-10 text-lg  ">{linkDoms}</div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
