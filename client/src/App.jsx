import Navbar from "./components/layout/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import About from "./components/About";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <About />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default App;