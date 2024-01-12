import "./App.css";
import React, { useState } from "react";
import { LightningAddress } from "@getalby/lightning-tools";
import { launchPaymentModal } from "@getalby/bitcoin-connect-react";

export default function App() {
  const [donationData, setDonationData] = useState({
    address: "",
    amount: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDonationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDonation = async () => {
    if (!donationData.address || !donationData.amount) {
      alert("Please fill in both Lightning Address and Amount.");
      return;
    }

    const ln = new LightningAddress(donationData.address);
    await ln.fetch();
    const invoice = await ln.requestInvoice({ satoshi: donationData.amount });

    const { setPaid } = launchPaymentModal({
      invoice: invoice.paymentRequest,
      onPaid: ({ preimage }) => {
        clearInterval(checkPaymentInterval);
        alert(
          "Paid to:  " +
            donationData.address +
            " amount: " +
            donationData.amount +
            " sats" +
            " preimage: " +
            preimage,
        );
      },
      onCancelled: () => {
        alert("Payment cancelled");
      },
    });
    const checkPaymentInterval = setInterval(async () => {
      const paid = await invoice.verifyPayment();

      if (paid && invoice.preimage) {
        setPaid({
          preimage: invoice.preimage,
        });
      }
    }, 1000);
  };

  return (
    <main>
      <br />
      <h1 className="font-bold text-[rgb(25,108,233)] text-4xl text-center">
        Bitcoin Connect Donation Modal Demo
      </h1>
      <br />
      <p className="text-[rgb(25,108,233)] text-2xl text-center justify-center">
        This client side web application will request permission to donate to a
        lightning address using Bitcoin Connect.
      </p>

      <br />
      <form className="bg-neutral-800 text-[rgb(25,108,233)] max-w-sm mx-auto border-4 border-[rgb(25,108,233)] text-[rgb(25,108,233)] p-4 rounded-lg grid gap-4 md:flex-1 md:max-w-md my-2 md:my-8 lg:my-10 bg-white dark:bg-white w-full">
        <label className="text-center font-bold">
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

        <label className="m text-center font-bold">
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
      </form>

      <br />
      <hr />
      <br />
    </main>
  );
}
