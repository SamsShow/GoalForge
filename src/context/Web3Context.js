"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                if (typeof window.ethereum !== 'undefined') {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await provider.send("eth_requestAccounts", []);
                    const signer = await provider.getSigner();
                    const contract = new ethers.Contract(contractAddress, abi, signer);

                    setAccount(accounts[0]);
                    setContract(contract);
                    setProvider(provider);
                }
            } catch (error) {
                console.error('Error initializing web3:', error);
            } finally {
                setLoading(false);
            }
        };

        init();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts[0]);
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', (accounts) => {
                    setAccount(accounts[0]);
                });
            }
        };
    }, []);

    return (
        <Web3Context.Provider value={{ account, contract, provider, loading }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
} 