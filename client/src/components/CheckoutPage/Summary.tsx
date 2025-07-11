import React from "react";
import { numberToRupiah } from "../../utils/number-to-rupiah";

interface SummaryProps {
  subTotal: number;
  tax: number;
  totalAmount: number;
}

const Summary: React.FC<SummaryProps> = ({ subTotal, tax, totalAmount }) => {
  return (
    <>
      <div className="flex justify-between items-center mt-4">
        <span className="text-lg font-semibold">Sub-Total</span>
        <span className="text-xl font-bold">{numberToRupiah(subTotal)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Pajak (11%)</span>
        <span className="text-xl font-bold">{numberToRupiah(tax)}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-xl font-bold">{numberToRupiah(totalAmount)}</span>
      </div>
    </>
  );
};

export default Summary;
