"use client";
import React, { useEffect, useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { useAppKit, useWalletInfo } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

const CustomConnectButton = () => {
  const { open } = useAppKit();
  const { address: initialAddress } = useAccount();
  const [address, setAddress] = useState(null);
  const { walletInfo } = useWalletInfo();

  useEffect(() => {
    setAddress(initialAddress);
  }, [initialAddress]);

  return (
    <button
      onClick={() => open({ view: address ? 'Account' : 'Connect' })}
      className="bg-primary px-4 py-2 rounded-lg text-secondary hover:bg-primaryHover transitio flex items-center justify-center shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
    >
      {address ? (
        <span>
          {address.substring(0, 6)}...{address.substring(address.length - 4)}
        </span>
      ) : (
        <>
          <FaWallet className="mr-2" /> Connect Wallet
        </>
      )}
    </button>
  );
};

export default CustomConnectButton;
