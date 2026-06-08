import Link from "next/link";

const features = [
  { icon: "🔧", title: "Expert Workers", desc: "Verified professionals for every job." },
  { icon: "📅", title: "Easy Booking", desc: "Book a service in under 2 minutes." },
  { icon: "⭐", title: "Rated & Reviewed", desc: "Read real reviews before you book." },
  { icon: "🛡️", title: "Fully Insured", desc: "Every job is backed by our guarantee." },
];

const services = [
  { icon: "🔧", name: "Plumbing" },
  { icon: "⚡", name: "Electrical" },
  { icon: "🧹", name: "Cleaning" },
  { icon: "🖌️", name: "Painting" },
  { icon: "❄️", name: "AC Repair" },
  { icon: "🪚", name: "Carpentry" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-gray-900 text-xl">
              Fix<span className="text-orange-500">Mate</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-orange-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-orange-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Home Services Made Simple
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Trusted Home Services,{" "}
            <span className="text-orange-500">On Demand</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Connect with skilled, vetted professionals for plumbing, electrical,
            cleaning, and more — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-base"
            >
              Book a Service
            </Link>
            <Link
              href="/login"
              className="bg-white border border-gray-200 hover:border-orange-400 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-colors text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Our Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {services.map((s) => (
              <div
                key={s.name}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group"
              >
                <span className="text-3xl">{s.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Why Choose FixMate?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-orange-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-orange-100 mb-8">
            Join thousands of homeowners who trust FixMate for all their home
            service needs.
          </p>
          <Link
            href="/register"
            className="bg-white text-orange-500 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors inline-block"
          >
            Create a Free Account
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400">
        © 2026 FixMate. All rights reserved.
      </footer>
    </div>
  );
}
