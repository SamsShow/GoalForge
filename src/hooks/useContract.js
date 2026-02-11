import { useContractRead, useWriteContract } from 'wagmi';
import abi from '../config/abi.json';
import { contractAddress, nftContractAddress } from '../config/contractAddress';

// Read hooks
export function useUserGoals(address) {
    return useContractRead({
        address: contractAddress,
        abi,
        functionName: 'getUserGoals',
        args: address ? [address] : undefined,
        enabled: Boolean(address),
        watch: true,
    });
}

export function useGetAllGoals() {
    return useContractRead({
        address: contractAddress,
        abi,
        functionName: 'getAllGoals',
        watch: true,
    });
}

export function useUserNFTs(address) {
    return useContractRead({
        address: contractAddress,
        abi,
        functionName: 'getUserNFTs',
        args: address ? [address] : undefined,
        enabled: Boolean(address),
        watch: true,
    });
}

export function useHasOnboarded(address) {
    return useContractRead({
        address: contractAddress,
        abi,
        functionName: 'hasUserOnboarded',
        args: address ? [address] : undefined,
        enabled: Boolean(address),
    });
}

export function useUserBalance(address) {
    return useContractRead({
        address: contractAddress,
        abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        enabled: Boolean(address),
        watch: true,
    });
}

export function useUserStakes(address) {
    return useContractRead({
        address: contractAddress,
        abi,
        functionName: 'userStakes',
        args: address ? [address] : undefined,
        enabled: Boolean(address),
        watch: true,
    });
}
