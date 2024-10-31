const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");
//Relacionar a foto ao usuário
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  //criar foto

  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  if (!newPhoto) {
    res.status(422).json({ errors: ["Erro ao inserir a foto"] });
    return;
  }

  res.status(201).json(newPhoto);
};

//Delete Photo
const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada"] });
    }

    if (!photo.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
      return;
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluida com sucesso" });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
    return;
  }
};

//Obter todas as fotos

const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

const getUserPhotos = async (req, res) => {
  const { id } = req.params;
  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
  if (!photo) {
    res.status(404).json({ errors: ["Imagem não encontrada"] });
    return;
  }
  res.status(200).json(photo);
};

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ["Imagem não encontrada"] });
    return;
  }

  if (!photo.userId.equals(reqUser._id)) {
    res.status(422).json({ errors: ["Você não pode editar esta foto"] });
  }

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso" });
};

const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ["Imagem não encontrada"] });
    return;
  }

  //Check se já tem like na photo, se sim, remove
  if (photo.likes.includes(reqUser._id)) {
    let index = photo.likes.indexOf(reqUser._id);
    photo.likes.splice(index, 1);
    await photo.save();
    res.status(200).json({
      photoId: id,
      message: ["Removeu o like da photo"],
      photo: photo,
      userId: reqUser._id,
    });
    return;
  }

  photo.likes.push(reqUser._id);
  photo.save();

  res.status(200).json({
    photoId: id,
    message: ["A foto foi curtida"],
    photo: photo,
    userId: reqUser._id,
  });
};

//Comentar na foto
const commentPhoto = async (req, res) => {
  const { id } = req.params;

  const user = req.user;

  const { comment } = req.body;

  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };
  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ["Imagem não encontrada"] });
    return;
  }

  photo.comments.push(userComment);
  photo.save();

  res.status(200).json({
    comment: userComment,
    message: "Comentário incluido com sucesso",
    photo: photo,
  });
};

//Busca foto por titulo
const searchPhotos = async (req, res) => {
  const { q } = req.query;

  const photo = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photo);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
