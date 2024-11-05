import "./Search.css";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//redux
import {
  getAllPhotos,
  likePhoto,
  commentPhoto,
  clearPhotos,
} from "../../slices/photoSlice";
import PhotoComp from "../../components/PhotoComp";

const Search = () => {
  //usuário logado
  const { user: userAuth } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { photos, photo } = useSelector((state) => state.photo);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      // Função de desmontagem, executada apenas quando o componente desmonta
      return () => {
        dispatch(clearPhotos());
        isMounted = false;
      };
    }
  }, []);

  return (
    //IMPLANTAR O PHOTOCOMP EM MAP
    <>
      {photos && Array.isArray(photos) && photos.length > 0 ? (
        photos.map((photo) => {
          return <PhotoComp key={photo._id} photo={photo} />;
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
export default Search;
