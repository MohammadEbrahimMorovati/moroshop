import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-red-500 drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl font-bold mt-4">صفحه یافت نشد</h2>
        <p className="text-gray-600 mt-2">
          متأسفیم! آدرس وارد شده معتبر نیست یا صفحه مورد نظر وجود ندارد.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-red-500 text-white rounded-lg shadow-md font-semibold hover:bg-red-600 transition-transform hover:scale-105"
        >
          بازگشت به خانه
        </Link>
      </div>
    </section>
  );
}
