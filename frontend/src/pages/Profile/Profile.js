import "./Profile.css";

import { uploads } from "../../utils/config";

import { Link } from "react-router-dom";
import { BsPencilFill, BsXLg } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";

//hooks
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

//Redux
import { getUserDetails } from "../../slices/userSlice";
import {
  publishPhoto,
  resetMessage,
  getUserPhotos,
  deletePhoto,
  likePhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const handleLike = (photo) => {
    const id = photo._id;
    dispatch(likePhoto(id));
  };

  //Do usuário que estamos buscando
  const { user, loading } = useSelector((state) => state.user);

  //Do usuário logado
  const { user: userAuth } = useSelector((state) => state.auth);

  //Estados
  const { photo, photos } = useSelector((state) => state.photo);

  //Formulário e edit Form
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  //States
  const [title, setTitle] = useState("");
  const [newImage, setNewImage] = useState("");

  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");

  //Carregar dados do usuário.
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id, photo]);

  const handleDelete = (id) => {
    dispatch(deletePhoto(id));
  };

  const editToggle = () => {
    if (editPhotoForm.current.classList.contains("hide")) {
      editPhotoForm.current.classList.toggle("hide");
      newPhotoForm.current.classList.toggle("hide");
    }
  };

  const del_edit = () => {
    setEditImage("");
    setEditTitle("");
    setEditId("");
    editPhotoForm.current.classList.toggle("hide");
    newPhotoForm.current.classList.toggle("hide");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const photoData = {
      userName: userAuth.userName,
      title: editTitle,
      id: editId,
    };
    console.log(photoData);
    await dispatch(updatePhoto(photoData));
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", newImage); // Diretamente adiciona a imagem

    await dispatch(publishPhoto(formData));

    setTitle("");
    setNewImage("");
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  return (
    <div id="profile">
      <div className="profile_header">
        {user.profileImage && (
          <img
            src={`${uploads}/users/${user.profileImage}`}
            alt={user.name}
            className="profile_image"
          />
        )}
        <div className="profile_description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>

      <div id="profile-posts">
        {userAuth && user._id === userAuth._id && (
          //NOVA FOTO
          <div className="postar" ref={newPhotoForm}>
            <div>
              <h3>Compartilhe momentos e sensações</h3>
              <form onSubmit={submitHandle}>
                <label>
                  <span>Titulo da foto</span>
                  <input
                    type="text"
                    placeholder="Digite o titulo da sua foto"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    value={title}
                    autoComplete="off"
                  />
                </label>
                <label>
                  <span>Imagem</span>
                  <input
                    type="file"
                    onChange={(e) => {
                      setNewImage(e.target.files[0]);
                    }}
                  />
                </label>
                {!loading && <input type="submit" value="Postar" />}
                {loading && <input type="submit" value="Aguarde..." disabled />}
              </form>
            </div>

            {newImage && (
              <img
                id="postpreview"
                src={newImage && URL.createObjectURL(newImage)}
                alt="Novafoto"
              />
            )}
          </div>
        )}

        {userAuth && user._id === userAuth._id && (
          <>
            <div className="editimage hide" ref={editPhotoForm}>
              <form onSubmit={handleUpdate}>
                <span>Titulo da foto</span>
                <input
                  type="text"
                  autoComplete="off"
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                  }}
                  value={editTitle || ""}
                />
                <button
                  onClick={async (e) => {
                    await handleUpdate(e);
                    del_edit();
                  }}
                >
                  Editar
                </button>
              </form>
              <div>
                <img
                  src={`${uploads}/photos/${editImage.image}`}
                  alt={editImage.title}
                />
              </div>
              <button
                onClick={() => {
                  del_edit();
                }}
              >
                X
              </button>
            </div>
          </>
        )}

        <div className="userposts">
          {photos &&
            photos.map((photo) => {
              return (
                <div className="photouser" key={photo._id}>
                  <Link className="link" to={`/photos/${photo._id}`}>
                    <img
                      src={`${uploads}/photos/${photo.image}`}
                      alt={photo.title}
                    />
                  </Link>
                  <h3>{photo.title}</h3>
                  {id === userAuth._id ? (
                    <div className="toolbar_profile">
                      <span id="like">
                        {Array.isArray(photo.likes) &&
                          photo.likes.length > 0 && <p>{photo.likes.length}</p>}
                        {Array.isArray(photo.likes) &&
                        photo.likes.includes(userAuth._id) ? (
                          <span
                            onClick={() => {
                              handleLike(photo);
                            }}
                          >
                            {" "}
                            <FaHeart className="liked" />
                            <p>Descurtir</p>
                          </span>
                        ) : (
                          <span
                            onClick={() => {
                              handleLike(photo);
                            }}
                          >
                            <FaHeart className="black" />
                            <p>Curtir</p>
                          </span>
                        )}
                      </span>
                      <Link className="link" to={`/photos/${photo._id}`}>
                        <p>Comentar</p>
                      </Link>
                      <BsPencilFill
                        onClick={() => {
                          setEditImage(photo);
                          setEditTitle(photo.title);
                          setEditId(photo._id);
                          editToggle();
                        }}
                      />
                      <BsXLg
                        onClick={() => {
                          handleDelete(photo._id);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="toolbar_profile">
                      <span id="like">
                        {Array.isArray(photo.likes) &&
                          photo.likes.length > 0 && <p>{photo.likes.length}</p>}
                        {Array.isArray(photo.likes) &&
                        photo.likes.includes(userAuth._id) ? (
                          <span
                            onClick={() => {
                              handleLike(photo);
                            }}
                          >
                            {" "}
                            <FaHeart className="liked" />
                            <p>Descurtir</p>
                          </span>
                        ) : (
                          <span
                            onClick={() => {
                              handleLike(photo);
                            }}
                          >
                            <FaHeart className="black" />
                            <p>Curtir</p>
                          </span>
                        )}
                      </span>
                      <Link className="link" to={`/photos/${photo._id}`}>
                        <p>Comentar</p>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          {photos.length === 0 && <h2>Este usuário ainda não tem fotos</h2>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
