import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import StartupPage from "./components/StartupPage.jsx";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={StartupPage()} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
