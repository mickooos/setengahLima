import React from "react";

interface PhoneNumberProps {
  noTelp: string | undefined;
  setNoTelp: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({ noTelp, setNoTelp }) => {
  return (
    <div className="mt-4 relative">
      <label
        className="block text-gray-900 font-bold mb-2"
        htmlFor="phone-number"
      >
        No. Telp
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
          +62
        </span>
        <input
          type="tel"
          id="phone-number"
          value={noTelp || ""}
          onChange={(e) => setNoTelp(e.target.value)}
          className="w-full pl-12 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-900"
        />
      </div>
    </div>
  );
};

export default PhoneNumber;
