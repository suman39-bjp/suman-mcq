export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between">

        <h2 className="text-xl font-bold mb-4 md:mb-0">
          QuizGecko
        </h2>

        <div className="space-y-2">
          <p>About</p>
          <p>Features</p>
          <p>Contact</p>
        </div>

        <div className="space-y-2">
          <p>Privacy</p>
          <p>Terms</p>
        </div>

      </div>

      <p className="text-center mt-6 text-gray-400">
        © 2026 All rights reserved
      </p>
    </footer>
  );
}