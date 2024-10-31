import "./EditProfile.css";

import { uploads } from "../../utils/config";
import { profile, resetMessage } from "../../slices/userSlice";

//Hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateProfile } from "../../slices/userSlice";

//Components
import Message from "../../components/Message";

const EditProfile = () => {
  const { user, loading, error, success, message } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    setName(user.name);
    setBio(user.bio);
    setEmail(user.email);
  }, [user]);

  function handleFile(e) {
    const image = e.target.files[0];
    setPreviewImage(image);

    //Update profile image
    setProfileImage(image);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { name };

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }

    if (password) {
      userData.password = password;
    }

    //Cria formulário de envio, passando para cada chave de userdata do formulário, o valor de userData.
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  return (
    <div className="container_edit">
      <h1>Edite seus dados</h1>
      <form onSubmit={handleSubmit} className="form_edit">
        <p className="subtitle">Mostre quem você é!</p>
        <input
          type="text"
          value={name || ""}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="email"
          placeholder="seu email"
          disabled
          value={email || ""}
        />

        <label id="editprofile">
          <p className="subtitle">Imagem de perfil</p>
          {(user.profileImage || previewImage) && (
            <img
              className="profile_image"
              src={
                previewImage
                  ? URL.createObjectURL(previewImage)
                  : `${uploads}/users/${user.profileImage}`
              }
              alt="Sua foto de perfil"
            />
          )}
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <p className="subtitle">Mais sobre você</p>
          <input
            type="text"
            placeholder="Descrição do perfil"
            className="bio"
            value={bio || ""}
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />
        </label>
        <label>
          <p className="subtitle">Quer alterar sua senha?</p>
          <input
            type="password"
            value={password || ""}
            placeholder="Digite sua nova senha"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        {!loading && <input type="submit" value="Atualizar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </form>
    </div>
  );
};

export default EditProfile;
