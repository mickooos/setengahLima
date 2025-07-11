import React from "react";
import { numberToRupiah } from "../../utils/number-to-rupiah.ts";

interface CheckoutCardProps {
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CheckoutCard: React.FC<CheckoutCardProps> = ({
  name,
  price,
  quantity,
  imageUrl,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 ">
      <div className="flex items-center space-x-4">
        <img src={imageUrl} alt={name} className="w-16 h-16 object-cover" />
        <div>
          <h2 className="font-semibold">{name}</h2>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-800">{numberToRupiah(price)}</span>
        <div className="flex items-center space-x-2">
          <button onClick={onDecrease} className="p-1 bg-gray-200 rounded-full">
            -
          </button>
          <span>{quantity}</span>
          <button onClick={onIncrease} className="p-1 bg-gray-200 rounded-full">
            +
          </button>
        </div>
        <button onClick={onRemove} className="text-gray-800 text-sm">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CheckoutCard;
