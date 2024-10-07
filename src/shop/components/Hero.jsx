import { useState } from "react";
import { Truck, RefreshCcw, ShieldCheck, Flag } from "lucide-react";

export default function HeroSection() {
  const [activeAccessory, setActiveAccessory] = useState(0);
  const accessories = [
    {
      name: "Wheels",
      image:
        "https://plus.unsplash.com/premium_photo-1661443444726-38e00b169bb2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Lights",
      image:
        "https://images.unsplash.com/photo-1600598880294-d2ee6553c5e7?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Grills",
      image: "https://images.unsplash.com/photo-1532245128003-3db26c775465?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Exhausts",
      image: "https://images.unsplash.com/photo-1441148489547-da3f133be9ae?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl text-white font-extrabold tracking-tight sm:text-6xl">
              Elevate Your Ride with Premium Accessories
            </h1>
            <p className="text-xl text-blue-100">
              Discover top-quality automotive accessories to enhance your
              vehicle's performance and style.
            </p>
            <div className="flex space-x-4">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105">
                Shop Now
              </button>
              <button className="bg-transparent hover:bg-blue-700 text-white font-semibold py-3 px-6 border border-white rounded-full transition duration-300 hover:border-transparent">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl transform -rotate-6 scale-105 opacity-50"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <img
                src={accessories[activeAccessory].image}
                alt={accessories[activeAccessory].name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-2xl font-bold">
                  {accessories[activeAccessory].name}
                </h3>
                <p className="text-sm text-gray-300">Click to explore more</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              {accessories.map((accessory, index) => (
                <button
                  key={accessory.name}
                  onClick={() => setActiveAccessory(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeAccessory
                      ? "bg-yellow-500 scale-125"
                      : "bg-blue-300 hover:bg-blue-200"
                  }`}
                  aria-label={`View ${accessory.name}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              description: "On orders over $100",
            },
            {
              icon: RefreshCcw,
              title: "30 Day Returns",
              description: "Hassle-free returns",
            },
            {
              icon: ShieldCheck,
              title: "Secure Payments",
              description: "SSL encrypted checkout",
            },
            {
              icon: Flag,
              title: "Made in USA",
              description: "Supporting local business",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center group"
            >
              <div className="p-3 bg-blue-700 rounded-full transition-all duration-300 group-hover:bg-yellow-500">
                <feature.icon className="w-6 h-6 text-white group-hover:text-black" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-blue-200 group-hover:text-white transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
