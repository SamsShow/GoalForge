import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { abi } from '../config/abi.json';
import { contractAddress } from '../config/contractAddress';

// Read hooks
export function useUserGoals(address: `0x${string}` | undefined) {
  return useContractRead({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getUserGoals',
    args: address ? [address] : undefined,
    enabled: Boolean(address)
  });
}

// Write hooks
export function useCreateGoal() {
  return useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'createGoal'
  });
}

export function useVerifyGoal() {
  return useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'verifyGoal'
  });
}

export function useFailGoal() {
  return useContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'failGoal'
  });
} 