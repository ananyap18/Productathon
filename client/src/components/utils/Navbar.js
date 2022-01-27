import React, { useContext, useState } from "react";
import "./Navbar.css";
import { FaSearch } from "react-icons/fa";
import {FiMessageSquare} from "react-icons/fi";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import { LoginStatusContext } from "../Hooks/LoginStatusContext";

Modal.setAppElement("#root");
function Navbar() {
  // // state contains info of present user
  const { state } = useContext(UserContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginStatusContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const renderList = () => {
    if (isLoggedIn) {
      return [
        <li key={"0"} onClick={() => setModalIsOpen(true)}>
          <FaSearch />
        </li>,
        <Link to="/profile" key={"1"}>
          <li>{`Welcome back, ${state.nickname}`}</li>
        </Link>,
        <Link  to="/chat-room" key={"5"}>
        <li><FiMessageSquare /></li>
        </Link>,
        <Link to="/createPost" key={"2"}>
          <li className="navStyle btn">Create Post</li>
        </Link>,
        <Link to="/userSubPost" key={"3"}>
          <li className="navStyle">Subscribe Post</li>
        </Link>,
        <Link to="/logout" key={"4"}>
          <li className="navStyle btn">Log Out</li>
        </Link>
          
      ];
    } else {
      return [
        <Link to="/login" key={"3"}>
          <li className="navStyle">Log in</li>
        </Link>,
        <Link to="/signup" key={"4"}>
          <li className="navStyle btn">Sign up</li>
        </Link>,
      ];
    }
  };

  const fetchSearchResults = async (query) => {
    try {
      setSearch(query);
      const response = await fetch("/search-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ query }),
      });
      const resJSON = await response.json();
      console.log("search user", resJSON);
      setSearchResults(resJSON.user);
    } catch (e) {
      console.log(e);
    }
  };

  const searchResultArr = searchResults.map((user) => (
    <li key={user._id} onClick={() => {setModalIsOpen(false); setSearch("")}}>
      <Link to={(state._id === user._id)?'/profile':`/profile/${user._id}`}>{user.email} as {user.nickname}</Link>
    </li>
  ));

  return (
    <>
      <div>
        <nav>
          <Link to={isLoggedIn ? "/" : "/login"}>
            <h1>shoppu</h1>
          </Link>
          <ul>{renderList()}</ul>
        </nav>
      </div>
      <Modal
        isOpen={modalIsOpen}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        style={{
          content: {
            position: "relative",
            width: "90%",
          },
        }}
      >
        <form>
          <label>Email:</label>
          <input
            type="text"
            required
            onChange={(e) => fetchSearchResults(e.target.value)}
          />
        </form>
        <div className="output">
          <ul>
            {searchResults.length === 0 ? "No user found :(" : searchResultArr}
          </ul>
        </div>
        <div
          className="footer"
          onClick={() => {
            setModalIsOpen(false);
            setSearch("");
          }}
        >
          Close
        </div>
      </Modal>
    </>
  );
}

export default Navbar;
