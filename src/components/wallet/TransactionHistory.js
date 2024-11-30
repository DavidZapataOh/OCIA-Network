import { useAccount, useTransaction } from "wagmi";

export default function TransactionHistory() {
  const { address } = useAccount();
  const { data: transactions } = useTransaction({ address });

  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions?.map((tx) => (
          <li key={tx.hash}>
            {tx.hash} - {tx.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
