import { formatUnits } from 'ethers';

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (unixSeconds) =>  {
  const newDate = new Date(Number(unixSeconds) * 1000);
  return newDate.toLocaleDateString();
}

export const formatBalance = (balance, decimals) => {
  return Number(Number(formatUnits(balance, decimals)).toFixed(5));
};