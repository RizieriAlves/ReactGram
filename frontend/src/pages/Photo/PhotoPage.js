import { useSelector, useDispatch } from "react-redux";
import PhotoComp from "../../components/PhotoComp";
import { useEffect } from "react";
import { clearPhotos, getPhoto } from "../../slices/photoSlice";
import { useParams } from "react-router-dom";

const PhotoPage = () => {
  const { photo } = useSelector((state) => state.photo);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      // Função de desmontagem, executada apenas quando o componente desmonta
      return () => {
        dispatch(clearPhotos());
        isMounted = false;
      };
    }
  }, [dispatch]);

  return (
    <>
      <PhotoComp photo={photo} />
    </>
  );
};
export default PhotoPage;
