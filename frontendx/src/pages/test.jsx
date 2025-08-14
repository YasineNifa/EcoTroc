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

// --- Reusable Components ---
const NavLink = ({ href, children }) => (
  <a className="text-[#111815] text-sm font-medium leading-normal" href={href}>
    {children}
  </a>
);

const SearchBar = ({ placeholder, className = "" }) => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div
      className={`flex w-full flex-1 items-stretch rounded-lg h-full ${className}`}
    >
      <div className="text-[#63887c] flex border-none bg-[#f0f4f3] items-center justify-center pl-4 rounded-l-lg border-r-0">
        <SearchIcon />
      </div>
      <input
        placeholder={placeholder}
        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111815] focus:outline-0 focus:ring-0 border-none bg-[#f0f4f3] focus:border-none h-full placeholder:text-[#63887c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

// --- Page Section Components ---
const Header = () => (
  <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f4f3] px-10 py-3">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-4 text-[#111815]">
        <div className="size-4">
          <LogoIcon />
        </div>
        <h2 className="text-[#111815] text-lg font-bold leading-tight tracking-[-0.015em]">
          EcoTroc
        </h2>
      </div>
      <nav className="flex items-center gap-9">
        <NavLink href="#">How it works</NavLink>
        <NavLink href="#">Browse</NavLink>
        <NavLink href="#">Community</NavLink>
        <NavLink href="#">Help</NavLink>
      </nav>
    </div>
    <div className="flex flex-1 justify-end items-center gap-8">
      <div className="flex flex-col min-w-40 !h-10 max-w-64">
        <SearchBar placeholder="Search" />
      </div>
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#14b881] text-[#111815] text-sm font-bold leading-normal tracking-[0.015em]">
        <span className="truncate">Post</span>
      </button>
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwmbE41_L7I2c6l57w105Jl8fOnhvy4OO9-rhL14kOfgMisVTR_5_PyEGUBqvSKBCUErwCCwdAqYUj44sgEhTifaxNblfba3ehhLUBKrm97lF8i2OQbgm3l9RVh5_4B0_GfzlmtXXXcBrukuiEUDDbz3bQCCNK4eJEhaMJ3gVEeGz_33j0S-fQdzzcQTWd_B8qD9Ktx59ptChgDH6_fYrl8iOlbg83932SqN0ORElMN_BecXh8rkstC2FUnbtN9kSDpQrghPIAmnLf")`,
        }}
      ></div>
    </div>
  </header>
);

const Hero = () => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="@[480px]:p-4">
      <div
        className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3VV5NOoSNOsnMfu2GArX4jzQ0gCBlwmKLC9wD9V8wXVR54RnX75u5iWR7qjmLej2WoEKBX-ry58GrccRqHU2N9vpWtCSvvM-WA38ZcVNJorkX6FyDebZNLSlu8SUTTNytp1RFSZA7STgt-M0S9lIKTj-6DVgQ4X2iZuHOOxICS3bMj1H4Q_GUsFRsgjBOQ7fajIXD2_njz20I_-Wnh8J1r947n-i3KfXTqYk7vL4mY43-hD-3WmZdsrG6bpJSVMUx-rUQSVKT2y9i")`,
        }}
      >
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl">
            Trade, Share, and Thrive with EcoTroc
          </h1>
          <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base">
            Join a vibrant community where you can exchange items and services
            using our virtual currency. Discover new possibilities, reduce
            waste, and connect with like-minded individuals.
          </h2>
        </div>
        <div className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-[#63887c] flex border border-[#dce5e2] bg-white items-center justify-center pl-[15px] rounded-l-lg border-r-0">
              <SearchIcon size="20px" />
            </div>
            <input
              placeholder="Search for items or services"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111815] focus:outline-0 focus:ring-0 border border-[#dce5e2] bg-white focus:border-[#dce5e2] h-full placeholder:text-[#63887c] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="flex items-center justify-center rounded-r-lg border-l-0 border border-[#dce5e2] bg-white pr-[7px]">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#14b881] text-[#111815] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base">
                <span className="truncate">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorksCard = ({ icon, title, children }) => (
  <div className="flex flex-1 gap-3 rounded-lg border border-[#dce5e2] bg-white p-4 flex-col">
    <div className="text-[#111815]">{icon}</div>
    <div className="flex flex-col gap-1">
      <h2 className="text-[#111815] text-base font-bold leading-tight">
        {title}
      </h2>
      <p className="text-[#63887c] text-sm font-normal leading-normal">
        {children}
      </p>
    </div>
  </div>
);

const HowItWorks = () => (
  <div className="flex flex-col gap-10 px-4 py-10">
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-[#111815] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl max-w-[720px]">
          How EcoTroc Works
        </h1>
        <p className="text-[#111815] text-base font-normal leading-normal max-w-[720px]">
          EcoTroc simplifies the exchange of goods and services within our
          community. Here's how you can get started:
        </p>
      </div>
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#14b881] text-[#111815] text-sm font-bold leading-normal tracking-[0.015em] w-fit">
        <span className="truncate">Get Started</span>
      </button>
    </div>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
      <HowItWorksCard
        title="Post Your Items"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"></path>
          </svg>
        }
      >
        List items or services you're willing to exchange. Provide clear
        descriptions and photos to attract potential traders.
      </HowItWorksCard>
      <HowItWorksCard
        title="Exchange with Virtual Currency"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96,72.34,72.34,0,0,0,94,124.94L33.79,177c-.15.12-.29.26-.43.39a32,32,0,0,0,45.26,45.26c.13-.13.27-.28.39-.42L131.06,162A72,72,0,0,0,232,96,71.56,71.56,0,0,0,226.76,69ZM160,152a56.14,56.14,0,0,1-27.07-7,8,8,0,0,0-9.92,1.77L67.11,211.51a16,16,0,0,1-22.62-22.62L109.18,133a8,8,0,0,0,1.77-9.93,56,56,0,0,1,58.36-82.31l-31.2,33.81a8,8,0,0,0-1.94,7.1L141.83,108a8,8,0,0,0,6.14,6.14l26.35,5.66a8,8,0,0,0,7.1-1.94l33.81-31.2A56.06,56.06,0,0,1,160,152Z"></path>
          </svg>
        }
      >
        Earn virtual currency by trading your items or services. Use this
        currency to acquire items or services from other members.
      </HowItWorksCard>
      <HowItWorksCard
        title="Connect and Trade"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path>
          </svg>
        }
      >
        Browse listings, connect with other members, and negotiate trades. Build
        relationships within the community while exchanging goods and services.
      </HowItWorksCard>
    </div>
  </div>
);

const ExploreCard = ({ imageUrl, title, children }) => (
  <div className="flex flex-col gap-3 pb-3">
    <div
      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    ></div>
    <div>
      <p className="text-[#111815] text-base font-medium leading-normal">
        {title}
      </p>
      <p className="text-[#63887c] text-sm font-normal leading-normal">
        {children}
      </p>
    </div>
  </div>
);

const Explore = () => (
  <div className="flex flex-col gap-10 px-4 py-10">
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-[#111815] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl max-w-[720px]">
          Explore the Possibilities
        </h1>
        <p className="text-[#111815] text-base font-normal leading-normal max-w-[720px]">
          Discover the wide range of items and services available on EcoTroc.
          From books and clothing to home repairs and tutoring, there's
          something for everyone.
        </p>
      </div>
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#14b881] text-[#111815] text-sm font-bold leading-normal tracking-[0.015em] w-fit">
        <span className="truncate">Browse Listings</span>
      </button>
    </div>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
      <ExploreCard
        title="Items"
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDkhVjPtey-5pzRd8JsQPz4aeKZK7cc05ms7FoZ5vrby584d_rKKu4Feyon_ODyk-yCMdREB-xZO0fsQSjemkRHTm2HCu0BtwVN4HshTtv85uhiqum3kEl3XxhuCWIUopLh8b81x6wA1DiOd17UjhXTJQNBo4RnTCr6GV70dT6s-xzoODARimJqHwReht7lUxtYWpbo-7EmR6-1DQiKoLAMXYMa9pujvo4D4KEWRI7c4oQMQU_wJ-yiPDmxXKqZsM82bd6Mbb7y-OH7"
      >
        Find unique items you need or want, without spending traditional
        currency. Trade your unused possessions for something new and exciting.
      </ExploreCard>
      <ExploreCard
        title="Services"
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCEro4qhUPtzVkeyP_-Kd0tkWvB4IsBJwbuqyu4S7i9KWS_3sA7BTj21sPFxMIQz5K2usoStagoYoYIgwG2f5m2zEv3ZOrU9wEFkKGX-kVovpl6BuQJjLNiErgkw6WsPp85Y1fuu-dhu0NtMTvMBVmrC6eJUg38LAkEwMM_saz31F0-iO2V1Fugjo-4CS57ihfOp0hwZEAAqZpxD53144vd0d8zgXzKCvNDY83wxG4c4uuZzQ3oTMggbh7vDWB87tyQjiBoKoZIpMT0"
      >
        Offer your skills and expertise in exchange for services you require.
        Connect with talented individuals in your community.
      </ExploreCard>
      <ExploreCard
        title="Community"
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAONR4RQV8qGLEv23pxTfvGE72kyRfFkrjWI3vAShnS6Enix8xj3ZKf1M9BhFjTXkqP0hLKApjGBa1K0feHpZ73dYlrlyvBjGZ2wbSSW1ILDoRJ36csnjAlFEdNLLfZITk163kFK2kTMLk0_AWLBIGr-yaAJ3rsf-fbA1BdqBm_xnQ7B4S3uLAjxF-YGtFQAtjIgMpmAqNL3GnUCzLXaZaw0I18kGwG_ahNBccujBrXM27UM74U6ST2K5w3eAf11Ycc62sa1rZPkMSG"
      >
        Join a network of people committed to sustainable living and community
        collaboration. Share your experiences and build lasting connections.
      </ExploreCard>
    </div>
  </div>
);

const Footer = () => (
  <footer className="flex justify-center">
    <div className="flex max-w-[960px] flex-1 flex-col">
      <div className="flex flex-col gap-6 px-5 py-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
          <NavLink href="#">About</NavLink>
          <NavLink href="#">Contact</NavLink>
          <NavLink href="#">Terms of Service</NavLink>
          <NavLink href="#">Privacy Policy</NavLink>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-[#63887c]">
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path>
            </svg>
          </a>
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
            </svg>
          </a>
          <a href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
            </svg>
          </a>
        </div>
        <p className="text-[#63887c] text-base font-normal leading-normal">
          © 2023 EcoTroc. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

// --- Main App Component ---
function Test() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <Hero />
            <HowItWorks />
            <Explore />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Test;
