import React, { useState, useEffect } from 'react'
import './App.css';

import { Core } from '@quicknode/sdk';

function App() {

  const quicknode_rpc_url = 'https://evocative-quaint-river.quiknode.pro/7b3ba7ab1d968e4366b2192591a62e5bf5ce174b/'

  const [address, setAddress] = useState('')
  const [isValidAddress, setIsValidAddress] = useState(false)
  const [core, setCore] = useState(null)
  const [tokens, setTokens] = useState([])
  const [nativeTokenBalance, setNativeTokenBalance] = useState('')
  const [nativeTokenTransactions, setNativeTokenTransactions] = useState([])
  const [tokenTransactions, setTokenTransactions] = useState([])  
  const [tokenData, setTokenData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTrx, setIsLoadingTrx] = useState(false)

  const handlePaste = async () => {
    setIsLoading(true)
    setTokenData('')
    setTokenTransactions([])
    setNativeTokenTransactions([])
    
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
      
      nativeTokenHistory()
      
    }
    else{
      setTokens([])
      setIsValidAddress(false)
      setNativeTokenBalance('')
      setNativeTokenTransactions([])
    }

    setIsLoading(false)
  }

  const copyAddress = address => {
    navigator.clipboard.writeText(address)
    alert("Address Copied")
  }

  const handleSearch = async () => {
    setIsLoading(true)
    setTokenData('')
    setTokenTransactions([])
    setNativeTokenTransactions([])
    
    if(address.length === 42){
      setIsValidAddress(true)
      const response = await core.client.qn_getWalletTokenBalance({
        wallet: address,
      })

      console.log(response.result)
      setTokens(response.result)
      setNativeTokenBalance(response.nativeTokenBalance)

      nativeTokenHistory()
      
    }
    else{
      setTokens([])
      setIsValidAddress(false)
      setNativeTokenBalance('')
      setNativeTokenTransactions([])
    }

    setIsLoading(false)
  }

  const tokenHistory = async contract => {
    setIsLoadingTrx(true)
    setNativeTokenTransactions([])
    
    const history = await core.client.qn_getWalletTokenTransactions({
      address,
      contract
    })
    console.log(history)
    
    setTokenTransactions(history.paginatedItems)
    setTokenData(history.token)

    setIsLoadingTrx(false)
  }

  const nativeTokenHistory = async () => {
    setIsLoadingTrx(true)
    
    setTokenTransactions([])
    setTokenData('')

    if(address.length > 0) {
      const history = await core.client.qn_getTransactionsByAddress({
        address,
        perPage: 10,
      })
      
  
      console.log(history)
  
      setNativeTokenTransactions(history.paginatedItems)
    }

    setIsLoadingTrx(false)
  }

  useEffect(() => {
    
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

  useEffect(() => {
    handleSearch();
  }, [address])
  
  return (
    <div className="App bg-gray-100 min-h-screen min-w-screen">
      <div className='w-full px-4 py-5 bg-gray-800 text-gray-50 text-center md:text-left'>
        <h3 className='font-bold text-2xl font-playpen'>
            Check Tokns
        </h3>
      </div>
      
      <div className='w-full flex justify-between flex-wrap px-[20pt]'>
        <div className='py-5 md:py-12 w-full md:w-2/5'>

          <div className='w-full flex justify-center items-center border-collapse p-10 rounded-lg shadow-xl'>
            <input 
              type="text" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              className='border-2 border-gray-800 w-full px-3 py-4 rounded-l-lg text-xs italic bg-gray-100'
              placeholder='Enter Wallet Address'
              // disabled
            />

            {
              address.length === 0 || address.length === 42 ? (
                <button 
                  type="button"
                  className='h-auto w-auto px-6 bg-gray-800 text-xs py-5 rounded-r-lg text-gray-50 font-bold border-none'
                  onClick={handlePaste}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-copy font-bold" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
                  </svg>
                </button>
              )
              : (
                <button 
                  type="button"
                  className='h-auto w-auto px-6 bg-gray-800 text-xs py-5 rounded-r-lg text-gray-50 font-bold border-none'
                  onClick={handleSearch}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </button>
              )
            }
          </div>

          { 
            isValidAddress ? (

              isLoading ? (
                <div className='w-full p-5 flex justify-center items-center my-10'>
                  <div className='w-[40pt] h-[40pt] rounded-full border-4 border-l-transparent animate-spin border-gray-300'>

                  </div>
                </div>
              ) :
              
              tokens.length > 0 ? (
                <div className='shadow-lg w-full md:my-10 py-5 px-5 text-left text-gray-600 overflow-auto'>
                  
                  <div className='text-[8pt] m-3 md:m-4 text-red-500 font-bold italic'>
                    ** Click on any token to get its transactions history
                  </div>

                  <div className='p-3 md:p-5 rounded-lg shadow-inner w-full flex justify-between items-center cursor-pointer' onClick={() => nativeTokenHistory()}>
                    <h3 className='font-bold text-sm mdtext-lg'>
                      Available Balance: {Number(nativeTokenBalance).toLocaleString()} ETH
                    </h3>

                    <button 
                      className='bg-gray-700 rounded-md text-xs text-gray-50 p-2 font-bold'
                    >
                      Trxs
                    </button>
                  </div>

                  <table className='table table-auto w-full my-5 text-sm border-none'>
                    <thead>
                      <tr className='border-b-gray-200 border-b-2'>
                        <th className='px-5 py-4'>Name</th>
                        <th className='px-5 py-4'>Symbol</th>
                        <th className='px-5 py-4'>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        tokens && tokens.map((token, id) => (
                          <tr key={id} className='border-b-2 border-b-gray-200 cursor-pointer' onClick={() => tokenHistory(token.address)}>
                            <td className='px-5 py-4'>{token.name}</td>
                            <td className='px-5 py-4'>{token.symbol}</td>
                            <td className='px-5 py-4'>{(token.totalBalance/(10**token.decimals)).toLocaleString()}</td>
                            <td className='px-5 py-4'>
                              <button 
                                className='bg-gray-700 rounded-md text-xs text-gray-50 p-2 font-bold'
                              >
                                Trxs
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                      
                    </tbody>
                  </table>
                </div>
              )
              : (
                <div className='shadow-lg w-full my-10 py-5 px-5 text-left text-gray-500 uppercase overflow-auto'>
                  <div className='p-3 md:p-5 rounded-lg w-full md:w-1/2 my-5'>
                    <h3 className='font-bold text-sm'>
                      No token available on this wallet
                    </h3>
                  </div>
                </div>
              )
            ) : (
              address !== '' && address.length !== 42 && <div className='shadow-lg w-full my-10 py-5 px-5 text-left text-gray-500 uppercase overflow-auto'>
                <div className='p-3 md:p-5 rounded-lg w-full text-center my-5'>
                  <h3 className='font-bold text-sm'>
                    Invalid Wallet Address
                  </h3>
                </div>
              </div>
            )
          }
        </div>
        
        {
          isLoadingTrx && <div className='w-full md:w-2/5 p-5 flex justify-center items-center my-10'>
            <div className='w-[40pt] h-[40pt] rounded-full border-4 border-l-transparent animate-spin border-gray-300'>

            </div>
          </div>
        }
        
        {
          
          tokenTransactions.length > 0 && (

            <div className='md:px-3 w-full md:w-3/5'>
              <div className='shadow-lg w-full md:my-10 py-5 md:px-5 text-left text-gray-600 overflow-auto'>
                <div className='p-3 md:p-5 rounded-lg shadow-inner w-full md:w-1/2'>
                  <h3 className='font-bold text-sm md my-2'>
                    Token: {tokenData.name }
                  </h3>

                  { tokenData && (
                    <h3 className='font-bold text-sm md my-2'>
                      Genesis Block: #{tokenData.genesisBlock}
                    </h3> 
                  )}
                </div>
                <table className='table table-auto w-full my-5 text-sm border-none'>
                  <thead>
                    <tr className='border-b-gray-200 border-b-2'>
                      <th className='px-5 py-4'></th>
                      <th className='px-5 py-4'>From</th>
                      <th className='px-5 py-4'>To</th>
                      <th className='px-5 py-4'>Amount</th>
                      <th className='px-5 py-4'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tokenTransactions && tokenTransactions.map((token, id) => (
                        <tr key={id} className='border-b-2 border-b-gray-200'>
                          <td className='px-5 py-4'>
                            <div className='flex items-center'>
                              {
                                token.fromAddress === address ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-up-right text-red-600" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-left text-green-600" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/>
                                  </svg>
                                )
                              }
                            </div>
                          </td>
                          <td className='px-5 py-4'>
                            <div className='flex items-center space-x-3'>
                              <span>
                                <img src={`https://robohash.org/${token.fromAddress}`} className='h-[15pt] w-[15pt] rounded-full bg-gray-50 shadow-md' />
                              </span>
                              <span>{token.fromAddress.slice(0,6)}...{token.fromAddress.slice(-5)}</span>
                              <span className='bg-gray-700 text-gray-50 h-[18pt] w-[18pt] rounded-md flex justify-center items-center font-bold cursor-pointer'>
                                <svg onClick={() => copyAddress(token.fromAddress)} xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
                                </svg>
                              </span>
                            </div>
                          </td>
                          <td className='px-5 py-4'>
                            <div className='flex items-center space-x-3'>
                              <span>
                                <img src={`https://robohash.org/${token.toAddress}`} className='h-[15pt] w-[15pt] rounded-full bg-gray-50 shadow-md' />
                              </span>
                              <span>{token.toAddress.slice(0,6)}...{token.toAddress.slice(-5)}</span>
                              <span className='bg-gray-700 text-gray-50 h-[18pt] w-[18pt] rounded-md flex justify-center items-center font-bold cursor-pointer'>
                                <svg onClick={() => copyAddress(token.toAddress)} xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
                                </svg>
                              </span>
                            </div>
                          </td>
                          <td className='px-5 py-4'>${`${tokenData.symbol} `} {((Number(token.decimalReceivedAmount) === 0 ? Number(token.decimalSentAmount) : Number(token.decimalReceivedAmount))).toLocaleString()}</td>
                          <td className='px-5 py-4'>
                            <a 
                              href={`https://etherscan.io/tx/${token.transactionHash}`} 
                              target='_blank' 
                              rel="noreferrer"
                              className='bg-gray-700 rounded-md text-xs text-gray-50 p-2 font-bold'
                            >
                              Explore
                            </a>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        }

        {
          nativeTokenTransactions.length > 0 && (

            <div className='md:px-3 w-full md:w-3/5'>
              <div className='shadow-lg w-full md:my-10 py-5 md:px-5 text-left text-gray-600 overflow-auto'>
                <div className='p-3 md:p-5 rounded-lg shadow-inner w-full md:w-1/2'>
                  <h3 className='font-bold text-sm md my-2'>
                    Token: Ethereum
                  </h3>
                </div>
                <table className='table table-auto w-full my-5 text-sm border-none'>
                  <thead>
                    <tr className='border-b-gray-200 border-b-2'>
                      <th className='px-5 py-4'></th>
                      <th className='px-5 py-4'>From</th>
                      <th className='px-5 py-4'>To</th>
                      <th className='px-5 py-4'>Amount</th>
                      <th className='px-5 py-4'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      nativeTokenTransactions && nativeTokenTransactions.map((token, id) => (
                        <tr key={id} className='border-b-2 border-b-gray-200'>
                          <td className='px-5 py-4'>
                            <div className='flex items-center'>
                              {
                                token.fromAddress === address ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-up-right text-red-600" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-left text-green-600" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0v6z"/>
                                  </svg>
                                )
                              }
                            </div>
                          </td>
                          <td className='px-5 py-4'>
                            <div className='flex items-center space-x-3 w-auto'>
                              <span>
                                <img src={`https://robohash.org/${token.fromAddress}`} className='h-[15pt] w-[15pt] hidden md:block rounded-full bg-gray-50 shadow-md' />
                              </span>
                              <span>{token.fromAddress.slice(0,6)}...{token.fromAddress.slice(-5)}</span>
                              <div className='bg-gray-700 text-gray-50 p-2 md:p-1 h-[25px] w-[25px] md:h-[25px] md:w-[25px] rounded-md flex justify-center items-center font-bold cursor-pointer'>
                                <svg onClick={() => copyAddress(token.fromAddress)} xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
                                </svg>
                              </div>
                            </div>
                          </td>
                          <td className='px-5 py-4'>
                            <div className='flex items-center space-x-3 w-auto'>
                              <span>
                                <img src={`https://robohash.org/${token.toAddress}`} className='h-[15pt] w-[15pt] hidden md:block rounded-full bg-gray-50 shadow-md' />
                              </span>
                              <span>{token.toAddress.slice(0,6)}...{token.toAddress.slice(-5)}</span>
                              <div className='bg-gray-700 text-gray-50 p-2 md:p-1 h-[25px] w-[25px] md:h-[25px] md:w-[25px] rounded-md flex justify-center items-center font-bold cursor-pointer'>
                                <svg onClick={() => copyAddress(token.toAddress)} xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
                                </svg>
                              </div>
                            </div>
                          </td>
                          <td className='px-5 py-4'>{(Number(token.value) / (10 ** 18)).toLocaleString()} Eth</td>
                          <td className='px-5 py-4'>
                            <a 
                              href={`https://etherscan.io/tx/${token.transactionHash}`} 
                              target='_blank' 
                              rel="noreferrer"
                              className='bg-gray-700 rounded-md text-xs text-gray-50 p-2 font-bold'
                            >
                              Explore
                            </a>
                          </td>
                        </tr>
                      )
                    )}
                    
                  </tbody>
                </table>
              </div>
            </div>
          )
        }
        
      </div>

    </div>
  );
}

export default App;
