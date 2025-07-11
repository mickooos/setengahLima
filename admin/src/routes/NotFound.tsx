import { useNavigate } from "react-router-dom";
import notFound from "../assets/not-found.jpg";

function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="h-screen banner bg-white">
      <div className="max-w-screen-xl py-20 mx-auto px-6">
        <div className="flex flex-col items-center justify-center h-3/4 pt-24">
          <img
            className="w-96 object-contain rounded-lg"
            src={notFound}
            alt="error"
          />
          <button
            className="bg-amber-950 text-white px-8 py-2 focus:outline-none poppins rounded-full mt-8 transform transition duration-300 hover:scale-105"
            onClick={() => navigate("/")}
          >
            Go back to home
          </button>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
