import { api, requestConfig } from "../utils/config";

const profile = async (data, token) => {
  const config = requestConfig("GET", data, token);

  try {
    const res = await fetch(api + "/users/profile", config)
      .then((res) => res.json())
      .catch((err) => err);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true);

  try {
    const res = await fetch(api + "/users/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

//Get user details
const getUserDetails = async (id) => {
  const config = requestConfig("GET");
  try {
    const res = await fetch(api + "/users/" + id, config)
      .then((res) => res.json())
      .catch((res) => res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const userService = { profile, updateProfile, getUserDetails };
export default userService;
