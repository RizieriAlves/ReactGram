import { api, requestConfig } from "../utils/config";

//Register User
const register = async (data) => {
  const config = requestConfig("POST", data);

  try {
    //Url + corpo
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((err) => err);

    //Se der certo, recebe  o usuário, com login e token, deixa salvo no navegador
    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

//Logout
const logout = () => {
  localStorage.removeItem("user");
};

const login = async (data) => {
  const config = requestConfig("POST", data);

  try {
    //Url + corpo
    const res = await fetch(api + "/users/login", config)
      .then((res) => res.json())
      .catch((err) => err);

    //Se der certo, recebe  o usuário, com login e token, deixa salvo no navegador
    if (res) {
      localStorage.setItem("user", JSON.stringify(res));
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
