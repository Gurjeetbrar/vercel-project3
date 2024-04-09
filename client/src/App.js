import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import MatchState from "./context/MatchState";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Team from "./components/Team";
import MyMatches from "./components/MyMatches";
import JoinTeam from "./components/JoinFunTeam";
import { createContext, useState } from "react";
import JoinMatch from "./components/JoinMatch";
import MyAccount from "./components/MyAccount";
import Membership from "./components/Membership/Membership";
import EditInfo from "./components/EditInfo";
import PaymentForm from "./components/Membership/PaymentForm";
import MatchFixture from "./components/MatchFixture";
import Footer from "./components/Footer";
export const MatchContext = createContext();
function App() {
  const [team1, setTeam1] = useState([
    {
      Name: "Kohli",
      Role: "WicketKeeper",
    },
    {
      Name: "Sukhman",
      Role: "Batsman",
    },
  ]);

  const [team2, setTeam2] = useState([
    {
      Name: "Rohit",
      Role: "Batsman",
    },
    {
      Name: "Rahul",
      Role: "Bowler",
    },
    {
      Name: "Gurjeet",
      Role: "Bowler",
    },
  ]);

  const addTeam1Member = (member) => {
    setTeam1([...team1, member]);
  };
  const addTeam2Member = (member) => {
    setTeam2([...team2, member]);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mymatches" element={<MyMatches />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/team" element={<Team />} />
        <Route path="/joinfunteam" element={<JoinTeam />} />
        <Route path="/joinmatch" element={<JoinMatch />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/mymembership" element={<Membership />} />
        <Route path="/editUser" element={<EditInfo />} />
        <Route path="/mypayment" element={<PaymentForm />} />
        <Route path="/matchfixture" element={<MatchFixture />} />
      </Route>
    )
  );
  return (
    <>
      <ToastContainer />
      <MatchContext.Provider
        value={{ team1, team2, addTeam1Member, addTeam2Member }}
      >
        <RouterProvider router={router} />
      </MatchContext.Provider>
    </>
  );
}
const Root = () => {
  return (
    <>
      <div>
        <Navbar />
        
      </div>
      <div>
        <Outlet />
      </div>
      <div>
      <Footer />
      </div>
    </>
  );
};

export default App;
