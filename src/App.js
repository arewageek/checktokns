import React, { useState, useEffect } from 'react'
import './App.css';

import { Core } from '@quicknode/sdk';

function App() {

  const [address, setAddress] = useState('')
  const [isValidAddress, setIsValidAddress] = useState(false)
  const [core, setCore] = useState(null)
  const [tokens, setTokens] = useState([])
  const [nativeTokenBalance, setNativeTokenBalance] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePaste = async () => {
    setIsLoading(true)
    
    const copiedText = await navigator.clipboard.readText();
    setAddress(copiedText)

    if(copiedText.length === 42){
      setIsValidAddress(true)
      const response = await core.client.qn_getWalletTokenBalance({
        wallet: copiedText,
      })

      console.log(response.result)
      setTokens(response.result)
      setNativeTokenBalance(response.nativeTokenBalance)
      
    }
    else{
      setTokens([])
      setIsValidAddress(false)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const quicknode_rpc_url = 'https://yolo-long-bridge.ethereum-sepolia.discover.quiknode.pro/59d8208336c5c501e6165aa40196daa3632b383e/'
    
    const coreInstance = new Core({
      endpointUrl: quicknode_rpc_url,
      config: {
        addOns: {
          nftTokenV2: true
        }
      }
    })
    setCore(coreInstance)
  }, [])
  
  return (
    <div className="App bg-gray-100 min-h-screen min-w-screen">
      <div className='w-full px-4 py-5 bg-gray-800 text-gray-50 text-center md:text-left'>
        <h3 className='font-bold text-2xl font-playpen'>
            Check Tokens
        </h3>
      </div>
      
      <div className='px-[20pt] py-12'>

        <div className='w-full md:w-1/3 flex justify-center items-center border-collapse p-10 rounded-lg shadow-xl'>
          <input 
            type="text" 
            value={address} 
            onChange={e => setAddress(e.target.value)} 
            className='border-2 border-gray-500 w-full px-3 py-4 rounded-l-lg text-xs italic bg-gray-100'
            placeholder='Enter Wallet Address'
          />

          <button
            type="button"
            className='h-auto w-auto px-6 bg-gray-600 border-2 text-xs py-5 rounded-r-lg text-gray-50 font-bold'
            onClick={handlePaste}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-copy font-bold" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
            </svg>
          </button>
        </div>

        { 
          isValidAddress && (

            isLoading ? (
              <div className='w-full md:w-1/3 p-5 flex justify-center items-center my-10'>
                <div className='w-[50pt] h-[50pt] rounded-full border-4 border-l-transparent animate-spin border-gray-300'>

                </div>
              </div>
            ) :
            
            tokens.length > 0 ? (
              <div className='shadow-lg w-full md:w-2/3 my-10 py-5 px-5 text-left text-gray-600 overflow-auto'>
                <div className='p-3 md:p-5 rounded-lg shadow-inner w-full md:w-1/2 my-5'>
                  <h3 className='font-bold text-sm mdtext-lg'>
                    Available Balance: {Number(nativeTokenBalance).toLocaleString()} ETH
                  </h3>
                </div>
                <table className='table table-auto w-4/5 md:w-2/3 my-5 md:mx-5 shadow-inner text-sm border-none'>
                  <thead>
                    <tr>
                      <th className='px-5 py-4'>Name</th>
                      <th className='px-5 py-4'>Symbol</th>
                      <th className='px-5 py-4'>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tokens && tokens.map((token, id) => (
                        <tr key={id} className='border-b-2 border-b-gray-200 shadow-inner'>
                          <td className='px-5 py-4'>{token.name}</td>
                          <td className='px-5 py-4'>{token.symbol}</td>
                          <td className='px-5 py-4'>{(token.totalBalance/(10**token.decimals)).toLocaleString()}</td>
                        </tr>
                      )
                    )}
                    
                  </tbody>
                </table>
              </div>
            )
            : (
              <div className='shadow-lg w-full md:w-2/3 my-10 py-5 px-5 text-left text-gray-500 uppercase overflow-auto'>
                <div className='p-3 md:p-5 rounded-lg w-full md:w-1/2 my-5'>
                  <h3 className='font-bold text-sm'>
                    No token avalable on this wallet
                  </h3>
                </div>
              </div>
            )
          )
        }
      </div>
    </div>
  );
}

export default App;
