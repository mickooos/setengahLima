import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMeja } from "../context/MejaContext";
import Page from "../components/Welcome/Page";

const Welcome: React.FC = () => {
  const { setNoMeja } = useMeja();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const noMejaParam = searchParams.get("noMeja");
    if (noMejaParam) {
      setNoMeja(Number(noMejaParam)); // saving 'noMeja' in global state
    }
  }, [searchParams, setNoMeja, navigate]);

  const { noMeja } = useMeja();

  return (
    <div className="bg-black min-h-[100vh]">
      <Page noMeja={noMeja} />
    </div>
  );
};

export default Welcome;
