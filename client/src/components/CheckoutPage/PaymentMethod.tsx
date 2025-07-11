import React from "react";
import cashless from "../../assets/cashless.png";
import cash from "../../assets/cash.png";

interface PaymentMethodProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  onPaymentMethodChange,
}) => {
  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Metode Pembayaran
      </h3>
      <div className="flex space-x-4">
        <div
          className={`cursor-pointer p-2 border rounded-md ${
            paymentMethod === "CASHLESS" ? "border-blue-500" : "border-gray-300"
          }`}
          onClick={() => onPaymentMethodChange("CASHLESS")}
        >
          <img
            src={cashless}
            alt="Cashless Payment"
            className="w-16 h-16 object-contain"
          />
          <p className="text-center mt-2">Cashless</p>
        </div>
        <div
          className={`cursor-pointer p-2 border rounded-md ${
            paymentMethod === "CASH" ? "border-green-600" : "border-gray-300"
          }`}
          onClick={() => onPaymentMethodChange("CASH")}
        >
          <img
            src={cash}
            alt="Cash Payment"
            className="w-16 h-16 object-contain"
          />
          <p className="text-center mt-2">Tunai</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
