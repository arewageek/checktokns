const TokensTable = ({ tokens, handleTokenFetch }) => {
  const fetchTokenData = (address) => {
    handleTokenFetch(address);
    console.log({ address });
  };

  return (
    <table className="table table-auto w-full my-5 text-sm border-none">
      <thead>
        <tr className="border-b-gray-200 border-b-2">
          <th className="px-5 py-4">Name</th>
          <th className="px-5 py-4">Symbol</th>
          <th className="px-5 py-4">Balance</th>
        </tr>
      </thead>
      <tbody>
        {tokens &&
          tokens.map((token, id) => {
            return (
              tokens.name !== "" && (
                <tr
                  key={id}
                  className="border-b-2 border-b-gray-200 cursor-pointer"
                  onClick={() => fetchTokenData(token.address)}
                >
                  <td className="px-5 py-4">{token.name}</td>
                  <td className="px-5 py-4">{token.symbol}</td>
                  <td className="px-5 py-4">
                    {(
                      token.totalBalance /
                      10 ** token.decimals
                    ).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <button className="bg-gray-700 rounded-md text-xs text-gray-50 p-2 font-bold">
                      Trxs
                    </button>
                  </td>
                </tr>
              )
            );
          })}
      </tbody>
    </table>
  );
};

export default TokensTable;
