const express = require("express");
const router = express.Router();

//Controllers
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
} = require("../controllers/PhotoController");
//Middlewares
const {
  photoInsertValidation,
  photoUpdateValidation,
  commentValidation,
} = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");

//Routes

//Criar foto
router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoInsertValidation(),
  validate,
  insertPhoto
);

//Busca por titulo
router.get("/search", authGuard, searchPhotos);

//Deletar foto
router.delete("/:id", authGuard, deletePhoto);

//Obter todas as fotos do site
router.get("/", authGuard, getAllPhotos);

//Obter pelo id do usuário
router.get("/user/:id", authGuard, getUserPhotos);

//Obter foto pela ID da foto
router.get("/:id", authGuard, getPhotoById);

//Update  na foto (titulo)
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);

//Curtir foto
router.put("/like/:id", authGuard, likePhoto);

//Comentar foto
router.put(
  "/comment/:id",
  authGuard,
  commentValidation(),
  validate,
  commentPhoto
);

module.exports = router;
