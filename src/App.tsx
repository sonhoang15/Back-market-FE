import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Client/Section/Header";
import Approutes from "./Routes/AppRoutes";
import { ToastContainer } from 'react-toastify';
import Footer from "./components/Client/Section/Footer";

function App() {
  return (
    <>
      <div>
        <Header />
        <Approutes />
        <Footer />
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
    </>

  );
}

export default App;