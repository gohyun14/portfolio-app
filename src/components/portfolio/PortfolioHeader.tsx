import React from "react";

type PortfolioHeaderProps = {
  portfolioValue: number | undefined;
  portfolioChange: string | undefined;
};

const PortfolioHeader = ({
  portfolioValue,
  portfolioChange,
}: PortfolioHeaderProps) => {
  return (
    <section className="text-center">
      <h1 className="text-5xl font-medium text-gray-800">
        Your portfolio is worth{" "}
        <span
          className={`max-w-fit rounded-full border px-3 text-teal-800 shadow-md ${
            portfolioValue === undefined
              ? "animate-pulse border-teal-800 bg-teal-800"
              : "animate-none border-teal-500 bg-teal-300"
          }`}
        >
          ${portfolioValue === undefined ? "XXXX" : portfolioValue}
        </span>
      </h1>
      <h2 className="mt-2 text-2xl text-gray-700">
        {portfolioChange && parseFloat(portfolioChange) >= 0
          ? "An increase of "
          : "A decrease of "}{" "}
        {portfolioChange === undefined ? (
          <span className="max-w-fit animate-pulse rounded-full border border-teal-800 bg-teal-800 px-2 text-teal-800 shadow-sm">
            X.XX%
          </span>
        ) : (
          <span
            className={`max-w-fit rounded-full border px-2 shadow-sm ${
              portfolioChange && parseFloat(portfolioChange) >= 0
                ? "border-green-500 bg-green-300 text-green-800"
                : "border-red-500 bg-red-300 text-red-800"
            }`}
          >
            {portfolioChange === undefined ? "X.XX" : portfolioChange}
            <span className="text-xl"> %</span>
          </span>
        )}{" "}
        on the day.{" "}
        {portfolioChange && parseFloat(portfolioChange) >= 0
          ? "Nice job!"
          : "Could be worse!"}
      </h2>
    </section>
  );
};

export default PortfolioHeader;
