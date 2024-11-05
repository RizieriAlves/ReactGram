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

  const handleSearch = async () => {
    await navigate("/search");
    dispatch(searchPhotos(search));
  };

  return (
    <nav id="nav">
      {user ? (
        <>
          <Link
            to="/"
            onClick={async () => {
              await setSearch("");
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
            <svg
              onClick={handleSearch}
              stroke="currentColor"
              fill="currentColor"
              viewBox="0 0 16 16"
              id="search"
              xmlns="http://www.w3.org/2000/svg"
              width="16px"
              height="16px"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path>
            </svg>
          </form>
        </>
      ) : (
        <Link to="/">ReactGram</Link>
      )}

      <ul id="nav-links">
        {auth ? (
          <>
            <li>
              <Link
                to="/"
                onClick={async () => {
                  await setSearch("");
                  dispatch(getAllPhotos(userAuth._id));
                }}
              >
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
