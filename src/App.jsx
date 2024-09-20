import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

import '@solana/wallet-adapter-react-ui/styles.css'; // Default styles
import './App.css'; // Custom styles
import { RequestAirdrop } from './RequestAirdrop';

function App() {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new UnsafeBurnerWalletAdapter(),
    ], []);

    // Access the wallet data
    const { publicKey } = useWallet();

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="wallet-container">
                        <WalletMultiButton />
                        <WalletDisconnectButton />
                        
                        {/* Display public key if wallet is connected */}
                        {publicKey ? (
                            <div className="public-key-display">
                                <p>Connected Wallet:</p>
                                <p className="public-key">{publicKey.toString()}</p>
                            </div>
                        ) : (
                            <p>No wallet connected.</p>
                        )}

                        <RequestAirdrop />
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
