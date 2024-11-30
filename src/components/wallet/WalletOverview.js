import { useAccount, useBalance } from "wagmi";

export default function WalletOverview() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!isConnected) {
    return <p>Please connect your wallet to start using OCIA.</p>;
  }

  return (
    <div className="p-4 bg-elementBackground rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Wallet Overview</h2>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Balance:</strong> {balance?.formatted} {balance?.symbol}</p>
    </div>
  );
}