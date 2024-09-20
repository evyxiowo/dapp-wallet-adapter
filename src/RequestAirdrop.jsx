import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function RequestAirdrop() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const maxRetries = 3;

    const requestAirdrop = async () => {
        if (!publicKey) {
            setMessage("Please connect your wallet first.");
            return;
        }

        const solAmount = parseFloat(amount);
        if (isNaN(solAmount) || solAmount <= 0) {
            setMessage("Please enter a valid amount.");
            return;
        }

        try {
            setMessage("Requesting airdrop...");
            setLoading(true);
            setRetryCount(0);

            await attemptAirdrop(solAmount);
        } catch (error) {
            setMessage("Airdrop failed after multiple attempts. Please try again later.");
            console.error("Airdrop failed after retries:", error);
        } finally {
            setLoading(false);
        }
    };

    const attemptAirdrop = async (solAmount) => {
        let currentRetry = 0;
        while (currentRetry < maxRetries) {
            try {
                const signature = await connection.requestAirdrop(publicKey, solAmount * LAMPORTS_PER_SOL);
                await connection.confirmTransaction(signature, 'confirmed');
                setMessage("Airdrop successful!");
                return; // Exit the function if successful
            } catch (error) {
                currentRetry += 1;
                setRetryCount(currentRetry);
                console.warn(`Airdrop attempt ${currentRetry} failed. Retrying...`, error);
            }
        }

        throw new Error("Max retries reached. Airdrop failed.");
    };

    return (
        <div className="airdrop-container">
            <input
                type="text"
                placeholder="Enter amount in SOL"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="airdrop-input"
                disabled={loading}
            /> <br />
            <button 
                onClick={requestAirdrop}
                disabled={!publicKey || loading}
                className="airdrop-button"
            >
                {loading ? `Requesting... (${retryCount}/${maxRetries})` : "Request Airdrop"}
            </button> <br />
            <p>{message}</p>
            
        </div>
    );
}
