export default function Hero() {
  return (
    <section className="pt-32 pb-24 bg-gradient-to-r from-green-300 via-blue-100 to-green-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">

        {/* LEFT */}
        <div className="flex-1">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Study better with the help of AI
          </h1>

          <p className="mt-4 text-gray-700 text-lg">
            Turn any material into quizzes, flashcards, and study tools instantly.
          </p>

          <div className="mt-6 flex gap-3">
            <input
              type="text"
              placeholder="Type Script"
              className="px-4 py-3 rounded-md border w-40"
            />

           <button className="bg-black text-white px-6 py-3 rounded-md hover:scale-105 transition">
            Get Started
           </button>
          </div>
        </div>
      </div>
    </section>
  );
}
