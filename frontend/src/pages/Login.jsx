import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/odisha-pitha-hero.png";
import { useAuth } from "../store/AuthContext";

const foodVideo =
  "https://videos.pexels.com/video-files/3195650/3195650-uhd_2560_1440_25fps.mp4";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "customer@pitha.com", password: "Customer@123" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") await login({ email: form.email, password: form.password });
      else await register(form);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-temple">
      <img src={heroImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={heroImage}
        aria-label="Traditional food preparation video"
      >
        <source src={foodVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-temple/85 via-temple/55 to-temple/30" />
      <div className="motif-border absolute inset-0 -z-10 opacity-20" />

      <div className="container-page grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1fr_460px]">
        <div className="max-w-2xl text-white">
          <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            Odisha culinary heritage
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight md:text-7xl">Fresh Pithas, Panas, and festival flavors</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/82">
            Login to explore authentic Odia food stories, shop fresh batches, save favorites, and track your orders.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-white/25 bg-white/90 p-6 shadow-soft backdrop-blur-xl">
            <p className="font-semibold uppercase tracking-[0.2em] text-clay">{mode === "login" ? "Welcome back" : "Create account"}</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-temple">{mode === "login" ? "Login" : "Register"}</h1>
            <p className="mt-3 text-sm leading-6 text-ink/60">
              Enter the marketplace to order traditional Odisha Pithas and Panas.
            </p>
            <div className="mt-6 grid gap-4">
              {mode === "register" && <input className="input" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />}
              <input className="input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              <input className="input" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </div>
            {error && <p className="mt-4 rounded-md bg-sindoor/10 p-3 text-sm font-semibold text-sindoor">{error}</p>}
            <button className="btn-primary mt-6 w-full">{mode === "login" ? "Login" : "Create Account"}</button>
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-4 w-full text-sm font-semibold text-temple">
              {mode === "login" ? "New customer? Register" : "Already registered? Login"}
            </button>
            <p className="mt-4 text-xs leading-5 text-ink/55">Seed demo: admin@pitha.com / Admin@123 or customer@pitha.com / Customer@123</p>
          </form>
        </div>
      </div>
    </section>
  );
}
