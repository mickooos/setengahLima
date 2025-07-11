import { useEffect } from "react";
import { MIDTRANS_API_URL } from "../utils/const";

interface SnapPaymentOptions {
  onSuccess: (result: any) => void;
  onPending: (result: any) => void;
  onError: (result: any) => void;
  onClose: () => void;
}

export const useMidtransSnap = (clientKey: string) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = MIDTRANS_API_URL;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientKey]);

  const triggerSnap = (token: string, options: SnapPaymentOptions) => {
    window.snap.pay(token, options);
  };

  return { triggerSnap };
};
