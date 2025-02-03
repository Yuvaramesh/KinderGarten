import LetterNoteBook from "./components/LetterNoteBook";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Heropage from "./pages/Hero";

function App() {
  return (
    <div className="w-screen h-auto overflow-x-hidden">
      <Routes>
        <Route element={<Heropage />} path="/"></Route>
        <Route element={<LetterNoteBook />} path="/letternotebook"></Route>
      </Routes>
    </div>
  );
}

export default App;
