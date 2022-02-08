import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Car from "../components/svgs/car";
import Cart from "../components/svgs/cart";
import Clothes from "../components/svgs/clothes";
import Extra from "../components/svgs/extra";
import Fork from "../components/svgs/fork";
import HomeIcon from "../components/svgs/home";
import Supplimental from "../components/svgs/supplimental";
import Ticket from "../components/svgs/ticket";
import { createClient, getEnvelopeAmounts } from "../src/sheets";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const colors: Record<string, { color: string; icon: React.ReactNode }> = {
  Groceries: {
    color: "bg-green-200",
    icon: <Cart className="h-6 w-6 fill-green-600" />,
  },
  "Eating Out": {
    color: "bg-red-200",
    icon: <Fork className="h-6 w-6 fill-red-600" />,
  },
  Entertainment: {
    color: "bg-purple-200",
    icon: <Ticket className="h-6 w-6 fill-purple-600" />,
  },
  "Household Items": {
    color: "bg-yellow-200",
    icon: <HomeIcon className="h-6 w-6 fill-yellow-600" />,
  },
  Clothes: {
    color: "bg-cyan-200",
    icon: <Clothes className="h-6 w-6 fill-cyan-600" />,
  },
  Cars: {
    color: "bg-slate-200",
    icon: <Car className="h-6 w-6 fill-slate-600" />,
  },
  Extranious: {
    color: "bg-rose-200",
    icon: <Extra className="h-6 w-6 fill-rose-600" />,
  },
  Supplimental: {
    color: "bg-orange-200",
    icon: <Supplimental className="h-6 w-6 fill-orange-600" />,
  },
};

interface Props {
  envelopeAmounts: Record<string, string>;
  error?: Error;
}

const Home: NextPage<Props> = ({ envelopeAmounts, error }) => {
  if (error) {
    <div className="p-4">
      <p>{error.message}</p>
      <p className="p-4 bg-slate-100">{JSON.stringify(error)}</p>
    </div>;
  }
  const envelopes = Object.keys(envelopeAmounts).map((key) => {
    return (
      <div
        key={key}
        className="drop-shadow-lg bg-white rounded-lg flex justify-between items-center w-full p-3 m-1"
      >
        <div
          className={`${colors[key].color} rounded-lg w-16 h-14 flex justify-center items-center`}
        >
          {colors[key].icon}
        </div>
        <h1 className="font-bold text-sm text-left grow px-4">{key}</h1>
        <div
          className={`${
            envelopeAmounts[key].startsWith("-")
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          } shadow-sm rounded-lg w-20 h-14 text-sm flex justify-center items-center font-semibold`}
        >
          {envelopeAmounts[key]}
        </div>
      </div>
    );
  });

  return (
    <div className="w-full bg-slate-100">
      <Head>
        <title>Money Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-2xl font-bold text-left grow p-5 pb-2">
        {dateFormat.format(new Date())}
      </h1>
      <div className="w-full mx-auto flex items-center flex-col p-4 pb-24">
        {envelopes}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const client = await createClient();
    const envelopeAmounts = await getEnvelopeAmounts(client);

    return {
      props: {
        envelopeAmounts,
      },
    };
  } catch (e) {
    return {
      props: {
        envelopeAmounts: {},
        error: e,
      },
    };
  }
}

export default Home;
