import './App.css'
import React, { useState, useEffect } from "react";
import { LightningAddress } from "@getalby/lightning-tools";
import { Modal, launchModal, disconnect } from "@getalby/bitcoin-connect-react";

export default function App() {
  const [invoice, setInvoice] = useState('');
  const [connected, setConnected] = useState(false);
  const [donationData, setDonationData] = useState({
    address: '',
    amount: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDonationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    window.addEventListener("bc:connected", () => {
      setConnected(true);
    });
    window.addEventListener("bc:disconnected", () => {
      setConnected(false);
    });
  }, []);

  useEffect(() => {
    const generateInvoice = async () => {
      const ln = new LightningAddress(donationData.address);
      await ln.fetch();
      const invoice = await ln.requestInvoice({ satoshi: donationData.amount });
      setInvoice(invoice.paymentRequest);
    };

    generateInvoice();
  }, [donationData.address, donationData.amount]);

  const handleDonation = () => {
    launchModal({ invoice });
  };

  return (
    <main>
      <h1>Bitcoin Connect Donation Modal Demo</h1>
      <p>
        This client side web application will request permission to donate to a lightning adrress using Bitcoin Connect.
      </p>
      <br></br>
      <Modal />
      <form>
        <label>
          Lightning Address:
          <input
            type="text"
            name="address"
            value={donationData.address}
            onChange={handleInputChange}
          />
          <br></br>
        </label>
        <br />
        <label>
          Amount (sats):
          <input
            type="number"
            name="amount"
            value={donationData.amount}
            onChange={handleInputChange}
          />
          <br></br>
        </label>
        <br />
        <button type="button" onClick={handleDonation}>
          Send Donation
        </button>
      </form>
      {connected && (
        <button
          onClick={() => {
            disconnect();
            setConnected(false);
          }}
        >
          Disconnect
        </button>
      )}
      <hr />
      <a href="https://replit.com/@rolznz/Bitcoin-Connect-Request-Payment-Modal#src/App.jsx">
        Source code on replit
      </a>
    </main>
  );
}
