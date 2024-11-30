import { useSigner } from "wagmi";
import { ethers } from "ethers";

export default function ExecuteTransaction({ recipient, amount }) {
  const { data: signer } = useSigner();

  const handleSendTransaction = async () => {
    try {
      const tx = {
        to: recipient,
        value: ethers.utils.parseEther(amount),
      };
      const transactionResponse = await signer.sendTransaction(tx);
      console.log("Transaction sent:", transactionResponse.hash);
      await transactionResponse.wait(); // Esperar confirmación
      console.log("Transaction confirmed");
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <button
      onClick={handleSendTransaction}
      className="bg-primary px-4 py-2 text-secondary rounded-lg hover:bg-primaryHover"
    >
      Send {amount} AVAX
    </button>
  );
}
