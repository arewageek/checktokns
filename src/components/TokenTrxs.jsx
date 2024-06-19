import TrxsTable from "./TrxsTable";

const TokenTrxs = ({ data, address, tokenData }) => {
  return (
    <div className="md:px-3 w-full md:w-3/5">
      <div className="shadow-lg w-full md:my-10 py-5 md:px-5 text-left text-gray-600 overflow-auto">
        <div className="p-3 md:p-5 rounded-lg shadow-inner w-full md:w-1/2">
          <h3 className="font-bold text-sm md my-2">
            Token: {data && data.name}
          </h3>

          {data && (
            <h3 className="font-bold text-sm md my-2">
              Genesis Block: #{data.genesisBlock}
            </h3>
          )}
        </div>
        <TrxsTable
          address={address}
          transactions={data}
          tokenData={tokenData}
        />
      </div>
    </div>
  );
};

export default TokenTrxs;
