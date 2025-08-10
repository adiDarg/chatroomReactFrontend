import './styles/App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import StartupPage from "./components/StartupPage.jsx";
import ChatRoom from "./components/ChatRoom.jsx";

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route exact path="/" element={<StartupPage/>} />
          <Route exact path="/chatRoom" element={<ChatRoom/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
