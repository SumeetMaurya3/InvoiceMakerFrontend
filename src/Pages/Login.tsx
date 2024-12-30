import { Loginform } from "@/Components/Loginform";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../Components/ui/carousel";
import Header from "@/Components/Header";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay"




export default function Login() {
  const navigate = useNavigate();

  
  const handleClick = () => {  
    navigate("/signup");
  };
  return (
    <div className="flex flex-col h-screen bg-black text-white">

      <Header buttonText="Register" onButtonClick={handleClick} />

      <main className="flex flex-col lg:flex-row items-center justify-center bg-black min-h-screen">
  <div className="lg:w-1/2 flex justify-center items-center bg-black mx-auto hidden lg:flex">
    <Carousel
      className="lg:w-3/5"
      plugins={[
        Autoplay({
          delay: 1500,
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        <CarouselItem>
          <div>
            <img
              src="/slider1.png"
              alt="Connecting People With Technology"
              className="object-cover w-full rounded-l-[30px]"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div>
            <img
              src="/slider2.png"
              alt="Connecting People With Technology"
              className="object-cover w-full rounded-l-[30px]"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>

  <div className="lg:w-1/2 flex flex-col justify-center items-center bg-black px-10 py-2">
    <div className="lg:w-4/5">
      <img src="./Frame-39624.svg" alt="Logo" className="lg:w-1/3 my-2" />
      <h1 className="text-3xl font-bold mb-4">Let the Journey Begin!</h1>
      <p className="text-gray-400 mb-6">
        This is a basic Login page which is used for levitation assignment
        purpose.
      </p>
      <div className="bg-black">
        <Loginform />
      </div>
    </div>
  </div>
</main>

    </div>
  );
}

