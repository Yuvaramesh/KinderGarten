import LetterNoteBook from "./components/LetterNoteBook";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Heropage from "./pages/Hero";
import StrokeTeachingPage from "./components/StrokeTeachingPage";
import HandWrittenEvaluator from "./pages/HandWrittenEvaluator";

function App() {
  return (
    <div className="w-screen h-auto overflow-x-hidden">
      <Routes>
        <Route element={<Heropage />} path="/"></Route>
        <Route element={<LetterNoteBook />} path="/letternotebook"></Route>
        <Route element={<StrokeTeachingPage />} path="/stroke"></Route>
        <Route element={<HandWrittenEvaluator />} path="/hand"></Route>
        
      </Routes>
    </div>
  );
}

export default App;
