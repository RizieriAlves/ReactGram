import "./Auth.css";
//Components
import { Link } from "react-router-dom";
import Message from "../../components/Message";
//Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { register, reset } from "../../slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Nos permite usar as funções do redux, neste caso, o register e reset
  const dispatch = useDispatch();

  //Obtêm o estado de loading e error que estão dentro do authSlice.(authReducer)
  const { loading, error } = useSelector((state) => state.auth);

  function handleSubmit(e) {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
    };

    dispatch(register(user));
  }

  //disparando o dispatch, limpa os estados para que se atualizem de acordo com a nova requisição
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);
  return (
    <div>
      <form onSubmit={handleSubmit} id="form">
        <p className="subtitle">Cadastre-se para ver os Posts</p>
        <label className="label_auth">
          <p>Nome:</p>{" "}
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </label>
        <label className="label_auth">
          <p>Email:</p>{" "}
          <input
            type="email"
            placeholder="Email"
            value={email}
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
        <label className="label_auth">
          <p>Confirme sua senha:</p>
          <input
            type="password"
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </label>
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}

        <p className="black">
          Já possui conta?
          <Link to="/login" className="black">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
