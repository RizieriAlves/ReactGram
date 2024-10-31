import { FaHeart } from "react-icons/fa6";
import { uploads } from "../../utils/config";
import "./Home.css";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//redux
import { getAllPhotos, likePhoto, commentPhoto } from "../../slices/photoSlice";

const Home = () => {
  //usuário logado
  const { user: userAuth } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { photos, photo, loading } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(getAllPhotos(userAuth._id));
  }, [photo]);

  const [comment, setComment] = useState("");

  const handleLike = (photo) => {
    dispatch(likePhoto(photo));
  };

  const handleSubmit = (photo) => {
    const photoData = { photo: photo, comment: comment };
    dispatch(commentPhoto(photoData));
    setComment("");
  };

  const [likes, setLikes] = useState(false);
  const showLikes = () => {
    setLikes(!likes);
  };
  return (
    <>
      {Array.isArray(photos) && photos.length > 0 ? (
        photos.map((photo) => {
          return (
            <div id="photouser" key={photo._id}>
              <p className="photo">
                <img
                  src={`${uploads}/photos/${photo.image}`}
                  alt={photo.title}
                />
              </p>
              <span className="comments">
                <Link to={`/users/${photo.userId}`}>
                  <p>
                    <span>Publicada por: </span>
                    {photo.userName}
                  </p>
                </Link>
                <h2>{photo.title}</h2>
                <div className="toolbar">
                  <span id="like">
                    {Array.isArray(photo.likes) && photo.likes.length > 0 && (
                      <p className="black">{photo.likes.length}</p>
                    )}
                    {Array.isArray(photo.likes) &&
                    photo.likes.includes(userAuth._id) ? (
                      <>
                        <FaHeart
                          className="liked"
                          onClick={() => {
                            handleLike(photo._id);
                          }}
                        />{" "}
                        <span className="black">Descurtir</span>
                      </>
                    ) : (
                      <span className="black">
                        <FaHeart
                          onClick={() => {
                            handleLike(photo._id);
                          }}
                        />
                        Curtir
                      </span>
                    )}
                  </span>
                  {Array.isArray(photo.likes) && photo.likes.length > 0 ? (
                    !likes ? (
                      <>
                        {photo.likes.length > 1 ? (
                          <>
                            <p onClick={showLikes} id="likelist">
                              <span>Curtido por:</span>
                              <span>
                                {photo.likesName[0]} e mais{" "}
                                {photo.likes.length - 1}
                              </span>
                            </p>
                          </>
                        ) : (
                          <span>
                            {" "}
                            <p onClick={showLikes} id="likelist">
                              <span>Curtido por:</span>
                              {photo.likesName &&
                                photo.likesName.map((likeName, index) => {
                                  return <span key={index}>{likeName}</span>;
                                })}
                            </p>
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span id="likelist">
                          <span>Curtido por: </span>
                          <ul>
                            {photo.likesName.map((likeName) => {
                              return <li>{likeName}</li>;
                            })}
                          </ul>
                        </span>
                        <button onClick={showLikes} className="closebutton">
                          X
                        </button>
                      </>
                    )
                  ) : null}
                </div>
                <div className="type_comment">
                  <input
                    type="text"
                    placeholder="Escreva um comentário"
                    required
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <button
                    onClick={() => {
                      handleSubmit(photo);
                    }}
                  >
                    Comentar
                  </button>
                </div>

                {Array.isArray(photo.comments) &&
                  photo.comments.length > 0 &&
                  photo.comments.map((comment, index) => {
                    return (
                      <div className="comment" key={index}>
                        <Link to={`/users/${comment.userId}`}>
                          <img
                            className="photocomment"
                            src={`${uploads}/users/${comment.userImage}`}
                            alt={`${comment.userName}`}
                          />
                        </Link>
                        <span>
                          <Link to={`/users/${comment.userId}`}>
                            <h4>{comment.userName}</h4>
                          </Link>
                          <p>{comment.comment}</p>
                        </span>
                      </div>
                    );
                  })}
              </span>
            </div>
          );
        })
      ) : (
        <h1 className="nophotos">
          Não foram encontradas fotos,{" "}
          <Link to={`/users/${userAuth._id}`}>publique uma clicando aqui!</Link>
        </h1>
      )}
    </>
  );
};
export default Home;
