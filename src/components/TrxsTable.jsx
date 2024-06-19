import { copyAddress } from "../utils";

const TrxsTable = ({ transactions, address, tokenData }) => {
  console.log({ transactions });
  return (
    <table className="table table-auto w-full my-5 text-sm border-none">
      <thead>
        <tr className="border-b-gray-200 border-b-2">
          <th className="px-5 py-4"></th>
          <th className="px-5 py-4">From</th>
          <th className="px-5 py-4">To</th>
          <th className="px-5 py-4">Amount</th>
          <th className="px-5 py-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 &&
          transactions.map((token, id) => (
            <tr key={id} className="border-b-2 border-b-gray-200">
              <td className="px-5 py-4">
                <div className="flex items-center">
                  {token.fromAddress.toLowerCase() === address.toLowerCase() ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="currentColor"
                      className="bi bi-arrow-up-right text-red-600"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-down-left text-green-600"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"
                      />
                    </svg>
                  )}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center space-x-3 w-auto">
                  <span>
                    <img
                      src={`https://robohash.org/${token.fromAddress}`}
                      className="h-[15pt] w-[15pt] hidden md:block rounded-full bg-gray-50 shadow-md"
                      alt={tokenData.address}
                    />
                  </span>
                  <span>
                    {token.fromAddress.slice(0, 6)}...
                    {token.fromAddress.slice(-5)}
                  </span>
                  <div className="bg-gray-700 text-gray-50 p-2 md:p-1 h-[25px] w-[25px] md:h-[25px] md:w-[25px] rounded-md flex justify-center items-center font-bold cursor-pointer">
                    <svg
                      onClick={() => copyAddress(token.fromAddress)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="currentColor"
                      className="bi bi-copy"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"
                      />
                    </svg>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center space-x-3 w-auto">
                  <span>
                    <img
                      src={`https://robohash.org/${token.toAddress}`}
                      className="h-[15pt] w-[15pt] hidden md:block rounded-full bg-gray-50 shadow-md"
                      alt={token.toAddress}
                    />
                  </span>
                  <span>
                    {token.toAddress.slice(0, 6)}...
                    {token.toAddress.slice(-5)}
                  </span>
                  <div className="bg-gray-700 text-gray-50 p-2 md:p-1 h-[25px] w-[25px] md:h-[25px] md:w-[25px] rounded-md flex justify-center items-center font-bold cursor-pointer">
                    <svg
                      onClick={() => copyAddress(token.toAddress)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="currentColor"
                      className="bi bi-copy"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"
                      />
                    </svg>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                ${`${tokenData.symbol} `}{" "}
                {(Number(token.decimalReceivedAmount) === 0
                  ? Number(token.decimalSentAmount)
                  : Number(token.decimalReceivedAmount)
                ).toLocaleString()}
              </td>
              <td className="px-5 py-4">
                <a
                  href={`https://etherscan.io/tx/${token.transactionHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gray-700 rounded-md text-xs text-gray-50 p-2 font-bold"
                >
                  Explore
                </a>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default TrxsTable;
