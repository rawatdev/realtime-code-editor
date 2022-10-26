import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import HomePage from "./pages/HomePage.jsx"
import EditorPage from "./pages/EditorPage.jsx"

function App() {
  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
