import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Module from "./pages/Module";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/module/:id" element={<Module />} />
    </Routes>
  );
}
