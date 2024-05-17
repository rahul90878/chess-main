import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import Game from "./pages/Game";



function App() {

 

    return (
       <BrowserRouter>
       <Routes>
        <Route path="/" element={<Room/>} />
        <Route path="/game" element={<Game/>} />
       </Routes>
       </BrowserRouter>
    ); 
}

export default App;