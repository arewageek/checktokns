import React, { useState, useEffect } from "react";
import "./App.css";
import { QUICKNODE_RPC_URL } from "./config.js";

import { Core } from "@quicknode/sdk";
import TokensTable from "./components/TokensTable.jsx";
import TokenTrxs from "./components/TokenTrxs.jsx";
import NativeTrxs from "./components/NativeTrxs.jsx";

function App() {
  const [address, setAddress] = useState("");
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [core, setCore] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [nativeTokenBalance, setNativeTokenBalance] = useState("");
  const [nativeTokenTransactions, setNativeTokenTransactions] = useState([]);
  const [tokenTransactions, setTokenTransactions] = useState([]);
  const [tokenData, setTokenData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTrx, setIsLoadingTrx] = useState(false);

  const handlePaste = async () => {
    setIsLoading(true);
    setTokenData("");
    setTokenTransactions([]);
    setNativeTokenTransactions([]);

    const copiedText = await navigator.clipboard.readText();
    setAddress(copiedText);

    if (copiedText.length === 42) {
      setIsValidAddress(true);
      const response = await core.client.qn_getWalletTokenBalance({
        wallet: copiedText,
      });

      console.log(response.result);
      setTokens(response.result);
      setNativeTokenBalance(response.nativeTokenBalance);

      nativeTokenHistory();
    } else {
      setTokens([]);
      setIsValidAddress(false);
      setNativeTokenBalance("");
      setNativeTokenTransactions([]);
    }

    setIsLoading(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setTokenData("");
    setTokenTransactions([]);
    setNativeTokenTransactions([]);

    if (address.length === 42) {
      setIsValidAddress(true);
      const response = await core.client.qn_getWalletTokenBalance({
        wallet: address,
      });

      console.log(response.result);
      setTokens(response.result);
      setNativeTokenBalance(response.nativeTokenBalance);

      nativeTokenHistory();
    } else {
      setTokens([]);
      setIsValidAddress(false);
      setNativeTokenBalance("");
      setNativeTokenTransactions([]);
    }

    setIsLoading(false);
  };

  const tokenHistory = async (contract) => {
    setIsLoadingTrx(true);
    setNativeTokenTransactions([]);

    const history = await core.client.qn_getWalletTokenTransactions({
      address,
      contract,
    });
    console.log(history);

    setTokenTransactions(history.paginatedItems);
    setTokenData(history.token);

    setIsLoadingTrx(false);
  };

  const nativeTokenHistory = async () => {
    setIsLoadingTrx(true);

    setTokenTransactions([]);
    setTokenData("");

    if (address.length > 0) {
      const history = await core.client.qn_getTransactionsByAddress({
        address,
        perPage: 10,
      });

      console.log({ history, items: history.paginatedItems });

      setNativeTokenTransactions(history.paginatedItems);
    }

    setIsLoadingTrx(false);
  };

  useEffect(() => {
    const coreInstance = new Core({
      endpointUrl: QUICKNODE_RPC_URL,
      config: {
        addOns: {
          nftTokenV2: true,
        },
      },
    });
    setCore(coreInstance);
  }, []);

  useEffect(() => {
    handleSearch();
  }, [address]);

  return (
    <div className="App bg-gray-100 min-h-screen min-w-screen">
      <div className="w-full px-4 py-5 bg-gray-800 text-gray-50 text-center md:text-left">
        <h3 className="font-bold text-2xl font-playpen">Check Tokns</h3>
      </div>

      <div className="w-full flex justify-between flex-wrap px-[20pt]">
        <div className="py-5 md:py-12 w-full md:w-2/5">
          <div className="w-full flex justify-center items-center border-collapse p-10 rounded-lg shadow-xl">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-2 border-gray-800 w-full px-3 py-4 rounded-l-lg text-xs italic bg-gray-100"
              placeholder="Enter Wallet Address"
              // disabled
            />

            {address.length === 0 || address.length === 42 ? (
              <button
                type="button"
                className="h-auto w-auto px-6 bg-gray-800 text-xs py-5 rounded-r-lg text-gray-50 font-bold border-none"
                onClick={handlePaste}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-copy font-bold"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className="h-auto w-auto px-6 bg-gray-800 text-xs py-5 rounded-r-lg text-gray-50 font-bold border-none"
                onClick={handleSearch}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </button>
            )}
          </div>

          {isValidAddress ? (
            isLoading ? (
              <div className="w-full p-5 flex justify-center items-center my-10">
                <div className="w-[40pt] h-[40pt] rounded-full border-4 border-l-transparent animate-spin border-gray-300"></div>
              </div>
            ) : tokens.length > 0 ? (
              <div className="shadow-lg w-full md:my-10 py-5 px-5 text-left text-gray-600 overflow-auto">
                <div className="text-[8pt] m-3 md:m-4 text-red-500 font-bold italic">
                  ** Click on any token to get its transactions history
                </div>

                <div
                  className="p-3 md:p-5 rounded-lg shadow-inner w-full flex justify-between items-center cursor-pointer"
                  onClick={() => nativeTokenHistory()}
                >
                  <h3 className="font-bold text-sm mdtext-lg">
                    Available Balance:{" "}
                    {Number(nativeTokenBalance).toLocaleString()} ETH
                  </h3>

                  <button className="bg-gray-700 rounded-md text-xs text-gray-50 p-2 font-bold">
                    Trxs
                  </button>
                </div>

                <TokensTable
                  tokens={tokens}
                  handleTokenFetch={tokenHistory}
                ></TokensTable>
              </div>
            ) : (
              <div className="shadow-lg w-full my-10 py-5 px-5 text-left text-gray-500 uppercase overflow-auto">
                <div className="p-3 md:p-5 rounded-lg w-full md:w-1/2 my-5">
                  <h3 className="font-bold text-sm">
                    No token available on this wallet
                  </h3>
                </div>
              </div>
            )
          ) : (
            address !== "" &&
            address.length !== 42 && (
              <div className="shadow-lg w-full my-10 py-5 px-5 text-left text-gray-500 uppercase overflow-auto">
                <div className="p-3 md:p-5 rounded-lg w-full text-center my-5">
                  <h3 className="font-bold text-sm">Invalid Wallet Address</h3>
                </div>
              </div>
            )
          )}
        </div>

        {isLoadingTrx && (
          <div className="w-full md:w-2/5 p-5 flex justify-center items-center my-10">
            <div className="w-[40pt] h-[40pt] rounded-full border-4 border-l-transparent animate-spin border-gray-300"></div>
          </div>
        )}

        {tokenTransactions.length > 0 && !isLoading && (
          <TokenTrxs
            data={tokenTransactions}
            address={address}
            tokenData={tokenData}
          />
        )}

        {nativeTokenTransactions.length > 0 && isLoading && (
          <NativeTrxs address={"0x00"} transactions={nativeTokenTransactions} />
        )}
      </div>
    </div>
  );
}

export default App;
