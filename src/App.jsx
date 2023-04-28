import Home from "./pages/Home";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Service from "./pages/Service";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Meettheteam from "./pages/Meettheteam";
import SingleBlog from "./pages/SingleBlog";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/about" element={<About />} />
      <Route path="/service" element={<Service />} />
      <Route path="/meettheteam" element={<Meettheteam />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/blog/:id" element={<SingleBlog />} />
    </Routes>
  );
}

export default App;
