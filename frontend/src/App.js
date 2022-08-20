
import './App.css';
import { BrowserRouter as Router, Routes, Route , Navigate  } from "react-router-dom";
import Feed from "./Components/Feed/Feed"
import Landing from './Components/Landing';
function App() {
  return (
    <Router>
    <Routes>
   
      <Route path='/' element={<Landing/>} />
      <Route path='/home' element={<Feed/>} />
      
      <Route path = "*"  element={<Navigate replace to = "/"/>} />
    </Routes>
  </Router>
  );
}

export default App;
