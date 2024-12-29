import Header from "@/Components/Header";
import { Signupform } from "@/Components/Signupform";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleClick = () => {
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";

    // Redirect to the login page after logout
    navigate("/login");
  };
  return (
    <div className="flex flex-col h-screen bg-black text-white">
  <Header buttonText="Login" onButtonClick={handleClick} />

  <main className="flex flex-1 flex-col lg:flex-row items-stretch">
    <div className="flex flex-col justify-center lg:w-2/4 bg-black px-12 py-7">
      <h1 className="text-3xl font-bold mb-4">Sign up to begin journey</h1>
      <p className="text-gray-400 mb-6">
        This is a basic signup page which is used for levitation assignment
        purpose.
      </p>
      <Signupform />
    </div>

    {/* Right-aligned image container */}
    <div className="lg:w-3/5 bg-black py-10 flex justify-end">
      <div className="flex flex-col lg:h-full lg:items-end">
        <div className="lg:w-full hidden lg:block">
          <img
            src="./levi1.png"
            alt="Connecting People With Technology"
            className="object-cover w-full h-full rounded-l-[30px]"
          />
        </div>
      </div>
    </div>
  </main>
</div>

  );
}
