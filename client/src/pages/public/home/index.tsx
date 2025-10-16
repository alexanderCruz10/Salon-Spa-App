import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center bg-primary text-white px-20 py-6">
        <h1 className="text-2xl font-bold text-white ">S.H.E.Y</h1>

        <Button
          variant={"outline"}
          className="!bg-white !text-primary hover:!bg-gray-50 border-white"
        >
          <Link to="/login">Login</Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 min-h-[80vh] items-center px-20">
        <div>
          <div className="flex flex-col gap-3 mt-5">
            <h1 className="text-xl font-bold text-primary">
              Welcome to SHEY-SALON-SPA
            </h1>
            <p className="text-gray-700 text-sm font-semibold">
              SHEY-SALON-SPA is a platform that connects barbers with customers.
              It helps customers find barbers near them and book appointments
              with them.
            </p>
            <Button className="w-max"> Get Started</Button>
          </div>
        </div>

        <div className="flex justify-end items-center pl-10">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Barber salon logo"
            className="w-full max-w-md h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
