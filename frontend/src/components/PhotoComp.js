import React from "react";

import "./Photo.css";

import { FaHeart } from "react-icons/fa6";
import { uploads } from "../utils/config";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//redux
import { commentPhoto, getPhoto, likePhoto } from "../slices/photoSlice";

const PhotoComp = ({ photo }) => {
  const dispatch = useDispatch();

  //usuário logado
  const { user: userAuth } = useSelector((state) => state.auth);

  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(false);

  const handleLike = (photo) => {
    const id = photo._id;
    dispatch(likePhoto(id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const photoData = { photo: photo, comment: comment };
    console.log(photoData);
    dispatch(commentPhoto(photoData));
    setComment("");
  };

  const showLikes = () => {
    setLikes(!likes);
  };

  return (
    <div>
      {photo ? (
        <div id="photouser" key={photo._id}>
          <p className="photo">
            <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />{" "}
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
                  <p className="black">{photo.likes?.length}</p>
                )}
                {Array.isArray(photo.likes) &&
                photo.likes.includes(userAuth?._id) ? (
                  <>
                    <FaHeart
                      className="liked"
                      onClick={() => {
                        handleLike(photo);
                      }}
                    />{" "}
                    <span className="black">Descurtir</span>
                  </>
                ) : (
                  <span className="black">
                    <FaHeart
                      onClick={() => {
                        handleLike(photo);
                      }}
                    />
                    Curtir
                  </span>
                )}
              </span>
              {Array.isArray(photo.likes) && photo.likes.length > 0 ? (
                !likes ? (
                  <>
                    {photo.likes && photo.likes.length > 1 ? (
                      <p onClick={showLikes} id="likelist">
                        <span>Curtido por:</span>
                        {photo.likesName && photo.likesName[0]} e mais{" "}
                        {photo.likes.length - 1}
                        pessoas
                      </p>
                    ) : (
                      <span>
                        {" "}
                        <span onClick={showLikes} id="likelist">
                          <span>Curtido por:</span>
                          {photo.likesName?.map((likeName, index) => {
                            return <p key={index}>{likeName}</p>;
                          })}
                        </span>
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span id="likelist">
                      <span>Curtido por: </span>
                      <ul>
                        {photo.likesName?.map((likeName) => {
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
            <form onSubmit={handleSubmit} id="comment">
              <input
                type="text"
                placeholder="Escreva um comentário"
                required
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                value={comment}
              />{" "}
              <input type="submit" value="Comentar" />{" "}
            </form>

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
      ) : null}
    </div>
  );
};

export default PhotoComp;
