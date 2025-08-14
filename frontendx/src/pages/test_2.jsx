import React, { useState } from "react";

// --- SVG Icon Components ---
const LogoIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
      fill="currentColor"
    ></path>
  </svg>
);

const SearchIcon = ({ size = "24px" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 256 256"
  >
    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
  </svg>
);

const CaretDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20px"
    height="20px"
    fill="currentColor"
    viewBox="0 0 256 256"
  >
    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
  </svg>
);

// --- Reusable Components ---
const NavLink = ({ href, children }) => (
  <a className="text-[#0e1a13] text-sm font-medium leading-normal" href={href}>
    {children}
  </a>
);

const SearchBar = ({ placeholder, className = "" }) => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div
      className={`flex w-full flex-1 items-stretch rounded-lg h-full ${className}`}
    >
      <div className="text-[#51946b] flex border-none bg-[#e8f2ec] items-center justify-center pl-4 rounded-l-lg border-r-0">
        <SearchIcon />
      </div>
      <input
        placeholder={placeholder}
        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1a13] focus:outline-0 focus:ring-0 border-none bg-[#e8f2ec] focus:border-none h-full placeholder:text-[#51946b] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

const FilterButton = ({ children }) => (
  <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e8f2ec] pl-4 pr-2">
    <p className="text-[#0e1a13] text-sm font-medium leading-normal">
      {children}
    </p>
    <div className="text-[#0e1a13]">
      <CaretDownIcon />
    </div>
  </button>
);

const ResultItem = ({ title, description, jetons, imageUrl }) => (
  <div className="p-4">
    <div className="flex items-stretch justify-between gap-4 rounded-lg">
      <div className="flex flex-[2_2_0px] flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[#0e1a13] text-base font-bold leading-tight">
            {title}
          </p>
          <p className="text-[#51946b] text-sm font-normal leading-normal">
            {description}
          </p>
        </div>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-[#e8f2ec] text-[#0e1a13] text-sm font-medium leading-normal w-fit">
          <span className="truncate">{jetons} Jetons</span>
        </button>
      </div>
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      ></div>
    </div>
  </div>
);

// --- Page Section Components ---
const Header = () => (
  <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e8f2ec] px-10 py-3">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-4 text-[#0e1a13]">
        <div className="size-4">
          <LogoIcon />
        </div>
        <h2 className="text-[#0e1a13] text-lg font-bold leading-tight tracking-[-0.015em]">
          EcoTroc
        </h2>
      </div>
      <nav className="flex items-center gap-9">
        <NavLink href="#">Categories</NavLink>
        <NavLink href="#">Services</NavLink>
        <NavLink href="#">Map</NavLink>
        <NavLink href="#">About</NavLink>
      </nav>
    </div>
    <div className="flex flex-1 justify-end items-center gap-8">
      <div className="flex flex-col min-w-40 !h-10 max-w-64">
        <SearchBar placeholder="Search" />
      </div>
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e8f2ec] text-[#0e1a13] text-sm font-bold leading-normal tracking-[0.015em]">
        <span className="truncate">Post</span>
      </button>
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuANIhk5GA7HQ9GxhkisCwmIZot-ITLIHYEYeMLtVqsYVSOcsbeMLG0GJTLBQvgZO3rzWJ-5CvaOrO1RvBRrJ-FSQo2CKEHt5ti-TJYdSRbf8-gB1dpBbV6U0swXH2R7XFiAOkt6NG8Ajz85fVvfOYLZkOGNwE6FbJpnxTcHkb2mK_6qA5K7sAp4fXjqgX9BEQAuHEfE3-qHseMgtT8WX2dZ_laqz37XgGExHyV1KtiqbpSv6xXNYKYAOSNzEAFD1RmDGB4lFdCh_suD")`,
        }}
      ></div>
    </div>
  </header>
);

const mockResults = [
  {
    title: "Vintage Leather Jacket",
    description:
      "Classic brown leather jacket, size medium, excellent condition.",
    jetons: 150,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD__LF5KOfgqrIqS2LrppyObopkjJPSF3uSkeZlQndpqPz1TdZ1Zr9_HehpTmicOTnJhrbgRzWmjtjMWYFSSIJbLzfdgpKKlhMqu64cYj5ktmcRm33K-A9uOMuUjr0axO5Sku3kUrNYdO4fRPZebOb9B6U02FtJOaI2x9hnBBjBSitdVVllvojoYfXj5AuxOG7KDIVuIhgC_NjApzcPGBsSW55VggnvGlF6FOrDTH87ns8pT0xQzuNFZLbsqng9gWGxFJlCgcgo6RFt",
  },
  {
    title: "Guitar Lessons",
    description:
      "Experienced instructor offering guitar lessons for all levels.",
    jetons: 80,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGuefMm5OKxrT3ar2qG_w86T5oLmacUmxs_SiRkvAYzIQ6HciUe7Nr95inxoik_mwoVGugtb4yLbyg2cwR3f9iGMM1ertTggrfTlqi5m6bglUSAxzLZfFvzFchoGrbCWbW4tXGZjliotaQjD3rYVR4V4nbxzzB6RjI-1WYuNZHBBk89CZZw_fbdXbwDNRVnLTMGObOguUv9_cz09H5kQPmro8Or4Av4TIW-IcJUI6EUB2d9rSsIP_IYEmOWJDuv43t51H-12-wBu-m",
  },
  {
    title: "Handmade Ceramic Mug",
    description: "Unique, handcrafted ceramic mug with a beautiful glaze.",
    jetons: 30,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsJfzsQfX9SV96KjDTDjlaqbxhW8cfD2M7JAsYDHDq2SHFY8RNowsLI2LxKq6DH1m2ctV3R4pvrE5Hz-v0qMLBNtA0X_4NQ9eak3kteCxUJsjMk9kGC6Z7RZIKypjUoUe6q856Pb0pdA2nEyzaCgBRSLEj9cADxZ8GtgWgxj-u56M_dfX88DBjJcLWFXUElZdZKoa96y__jCqrqqoIKZ7iNzeKXU5MNsi3wfpifNj_aeYAYQUqRgypO8Nu7-CscHF4COZmXKaOeAiv",
  },
  {
    title: "Gardening Services",
    description:
      "Professional gardening services, including lawn care and planting.",
    jetons: 120,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBps1MhWSaPePLeZayXfDarB009l-BbOBnJ1xmQ_ua4AB9ZWKHtOtZS2i54KLWzduaPHFsWPPKOOVsJ4WSIxv2PEW5XJWxX7f97CxLPBJdB0Nzt61T6fUFG2RYrQskt1sAw-Ta1RCChp9EbfwgoTn4bQom1u4cZ0oTN5eCK6ypQEb8bjAHR6tZ2NmFZjN1tEr7aqwaY1ln-YC80SUosRoiPa6xpipo2jI7WlEQBfHv2Rfc17RLIf1-JXbWTbkT_Sc09Bd2AlMfH1mxk",
  },
  {
    title: "Photography Session",
    description:
      "Portrait photography session, including editing and digital delivery.",
    jetons: 200,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDb-er_QG9zl9FqX2ZUY4sWMWp-g9pA3nzs9kAXb44gYV-tuj8qTlqQJfZhxKkAebnQClcBm9XGQ7AOarxry0Kb4dzgxAV6yl21S9UOOz04sQRu0O0uD8D5OlPDfuQGRGP_OZSC2abj6hViS86fYdd4JWNZkJnDRQDB4QX_EWg_w-IwJpIGzB_TXE9RXUAjbtKcYRRVwtGATByk3xBn9dHxa-yWvmeHdaFsTr54csuMmE1LF3M0xjfxsm9zgfv4-_6LC6B1zcrWaQwa",
  },
];

// --- Main Test2 Component ---
function Test2() {
  const [searchValue, setSearchValue] = useState(
    "Search for items or services"
  );

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#f8fbfa] group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="px-4 py-3">
              <div className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-[#51946b] flex border-none bg-[#e8f2ec] items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <SearchIcon />
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e1a13] focus:outline-0 focus:ring-0 border-none bg-[#e8f2ec] focus:border-none h-full placeholder:text-[#51946b] px-4 rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <div className="flex items-center justify-center rounded-r-lg border-l-0 border-none bg-[#e8f2ec] pr-4">
                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-[#0e1a13] gap-2 text-base font-bold leading-normal tracking-[0.015em] h-auto min-w-0 px-0">
                      <div className="text-[#51946b]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24px"
                          height="24px"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <FilterButton>Category</FilterButton>
              <FilterButton>Location</FilterButton>
              <FilterButton>Price</FilterButton>
            </div>

            <h2 className="text-[#0e1a13] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Results
            </h2>

            {mockResults.map((item, index) => (
              <ResultItem key={index} {...item} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Test2;
