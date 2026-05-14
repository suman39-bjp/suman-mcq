const testimonials = [
  {
    name: "Rahul Sharma",
    text: "This tool completely changed how I study. Super fast and easy!",
  },
  {
    name: "Anita Das",
    text: "I created quizzes in seconds. Saves me hours every week.",
  },
  {
    name: "John Lee",
    text: "Amazing platform for students and educators alike.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-12">
          Why Users Love It
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition duration-300"
            >
              <p className="text-gray-600 mb-4">
                "{item.text}"
              </p>

              <h4 className="font-semibold">
                {item.name}
              </h4>

              <div className="text-yellow-500 mt-2">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}