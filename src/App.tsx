import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Section/Header";
import Approutes from "./Routes/AppRoutes";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Approutes />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;