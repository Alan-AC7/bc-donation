import './App.css';
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
    if (!donationData.address || !donationData.amount) {
      alert("Please fill in both Lightning Address and Amount.");
      return;
    }

    launchModal({ invoice });
  };

  return (
    <main>
      <h1 className="font-bold text-[rgb(25,108,233)]">Bitcoin Connect Donation Modal Demo</h1>
      <p className="text-[rgb(25,108,233)]">
        This client side web application will request permission to donate to a lightning address using Bitcoin Connect.
      </p>

      <Modal />

      <form className="bg-neutral-800 text-[rgb(25,108,233)] max-w-sm mx-auto border-4 border-[rgb(25,108,233)] text-[rgb(25,108,233)] p-4 rounded-lg grid gap-4 md:flex-1 md:max-w-md my-2 md:my-8 lg:my-10 bg-white dark:bg-white w-full">
        <label>
          Lightning Address:
          <br />
        </label>
        <input
          type="text"
          name="address"
          value={donationData.address}
          onChange={handleInputChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-50 dark:border-[rgb(25,108,233)] dark:placeholder-[rgb(25,108,233)] dark:text-[rgb(25,108,233)] dark:focus:ring-blue-500 dark:focus:border-[rgb(25,108,233)] dark:bg-gray-50"
        />

        <label className="m">
          <br />
          Amount (sats):
        </label>
        <input
          type="number"
          name="amount"
          value={donationData.amount}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-50 dark:border-[rgb(25,108,233)] dark:placeholder-[rgb(25,108,233)] dark:text-[rgb(25,108,233)] dark:focus:ring-blue-500 dark:focus:border-[rgb(25,108,233)] dark:bg-gray-50"
          required
        />

        <br />
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleDonation}
        >
          Send Donation
        </button>
        {connected && (
          <button
            onClick={() => {
              disconnect();
              setConnected(false);
            }}
            className="text-white bg-[rgb(25,108,233)] text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-4 py-2"
          >
            Disconnect
          </button>
        )}
      </form>

      <br />
      <hr />
      <br />
    </main>
  );
}
