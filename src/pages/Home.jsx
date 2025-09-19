import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

export default function Home() {
  // برای لود کامل پلاگین‌ها
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden text-white">
      {/* پس‌زمینه ذرات */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "#0a0a1a" }, // پس‌زمینه تیره
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 120, duration: 0.4 },
              push: { quantity: 3 },
            },
          },
          particles: {
            color: { value: ["#ec4899", "#ffffff"] }, // سرخابی + سفید
            links: {
              color: "#ec4899",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.8,
              direction: "none",
              outModes: { default: "out" },
            },
            number: {
              value: 90,
              density: { enable: true, area: 900 },
            },
            opacity: {
              value: 0.8,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.3,
                sync: false,
              },
            },
            shape: { type: "circle" },
            size: {
              value: { min: 1, max: 3 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.5,
                sync: false,
              },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />

      {/* محتوای اصلی */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
          🛍️ فروشگاه آنلاین
        </h1>
        <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-200">
          به فروشگاه ما خوش آمدید. جدیدترین محصولات را با بهترین قیمت‌ها مرور
          کنید و تجربه‌ای متفاوت از خرید آنلاین داشته باشید.
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-4 bg-white text-pink-600 font-semibold text-lg rounded-xl shadow-md hover:scale-110 transition-transform relative overflow-hidden group"
        >
          <span className="relative z-10">✨ نمایش محصولات</span>
          <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 opacity-0 group-hover:opacity-20 transition" />
        </Link>
      </div>
    </section>
  );
}
