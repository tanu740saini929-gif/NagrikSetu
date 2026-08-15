import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Situation from "./pages/Situation";
import Profile from "./pages/Profile";
import Benefits from "./pages/Benefits";
import SchemeDetails from "./pages/SchemeDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/situation"
          element={<Situation />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/benefits"
          element={<Benefits />}
        />

        <Route
          path="/scheme/:schemeId"
          element={<SchemeDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;