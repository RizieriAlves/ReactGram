import "./Auth.css";
//Components
import { Link } from "react-router-dom";
import Message from "../../components/Message";
//Hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { login, reset } from "../../slices/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  function handleSubmit(e) {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    dispatch(login(user));
  }

  //limpa os estados para que se atualizem de acordo com a nova requisição
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div>
      <form onSubmit={handleSubmit} id="form">
        <p className="subtitle">Entre para ver os Posts</p>
        <label className="label_auth">
          <p>Email:</p>{" "}
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label className="label_auth">
          <p>Senha:</p>{" "}
          <input
            type="password"
            value={password}
            placeholder="Senha"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        {!loading && <input type="submit" value="Entrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}

        <p className="black">
          Não possui conta?
          <Link to="/register" className="black">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
