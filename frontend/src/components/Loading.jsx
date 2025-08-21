const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="relative flex items-center justify-center">
        {/* Pulsating background circles */}
        <div className="absolute w-32 h-32 bg-blue-200 rounded-full animate-ping opacity-30"></div>
        <div
          className="absolute w-24 h-24 bg-blue-300 rounded-full animate-ping opacity-40"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Centered Logo */}
        <div className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg">
          <svg
            className={"w-10 h-10 text-blue-500"}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <p className="mt-8 text-lg font-semibold text-gray-600 tracking-wider">
        Loading...
      </p>
    </div>
  );
};

export default Loading;
