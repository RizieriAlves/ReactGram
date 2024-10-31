import "./Navbar.css";

//Components
import { NavLink, Link } from "react-router-dom";
import {
  BsSearch,
  BsHouseDoorFill,
  BsFillPersonFill,
  BsFillCameraFill,
} from "react-icons/bs";

//Hooks
import { useState } from "react";
import { useAuth } from "../hooks_funcs/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllPhotos, searchPhotos } from "../slices/photoSlice";

//Redux
import { logout, reset } from "../slices/authSlice";

function Navbar() {
  const { auth } = useAuth();
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };
  const { user: userAuth } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    dispatch(searchPhotos(search));
  };

  return (
    <nav id="nav">
      {user ? (
        <>
          <Link
            to="/"
            onClick={() => {
              setSearch("");
              dispatch(getAllPhotos(userAuth._id));
            }}
          >
            ReactGram
          </Link>
          <form id="search-form">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />{" "}
            <BsSearch onClick={handleSearch} />
          </form>
        </>
      ) : (
        <Link to="/">ReactGram</Link>
      )}

      <ul id="nav-links">
        {auth ? (
          <>
            <li>
              <Link to="/">
                <BsHouseDoorFill />
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <NavLink to={`users/${user._id}`}>
                    <BsFillCameraFill />
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/profile"}>
                    <BsFillPersonFill />
                  </NavLink>
                </li>
              </>
            )}
            <li onClick={handleLogout}>
              <span>Logout</span>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">Entrar</NavLink>
            </li>
            <li>
              <NavLink to="/register">Cadastrar</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
