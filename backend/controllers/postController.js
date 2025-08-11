const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");

const createPost = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    throw new BadRequestError("Başlık ve içerik zorunludur.");

  let imageUrl = "";
  //FormData ile image dosyası gelmişse yükle
  if (req.files?.image) {
    const file = req.files.image;
    if (!file.mimetype.startsWith("image"))
      throw new BadRequestError("Sadece resim yükleyin");

    //temp'e taşı
    const uploadPath = path.join(__dirname, "../tmp", file.name);
    await file.mv(uploadPath);

    const result = await cloudinary.uploader.upload(uploadPath, {
      folder: "posts",
    });
    imageUrl = result.secure_url;
    fs.unlinkSync(uploadPath);
  }
  const post = await Post.create({
    title,
    content,
    image: imageUrl,
    author: req.user.userId, // authMiddleware
  });
  res.status(StatusCodes.CREATED).json({ msg: "Gönderi oluşturuldu", post });
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find({})
    .populate("author", "name profileImage")
    .sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ count: posts.length, posts });
};

const getMyPosts = async (req, res) => {
  const posts = await Post.find({ author: req.user.userId }).sort({
    createdAt: -1,
  });
  res.status(StatusCodes.OK).json({ count: posts.length, posts });
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const post = await Post.findById(id);
  if (!post) throw new BadRequestError("Gönderi bulunamadı");
  if (post.author.toString() !== req.user.userId) {
    throw new UnauthenticatedError("Bu gönderiyi düzenleme yetkiniz yok.");
  }
  if (title) post.title = title;
  if (content) post.content = content;

  //opsiyonel: yeni resim gelmişse değiştir
  if (req.files?.image) {
    const file = req.files.image;
    if (!file.mimetype.startsWith("image"))
      throw new BadRequestError("Sadece resim yükleyin");

    const uploadPath = path.join(__dirname, "../tmp", file.name);
    await file.mv(uploadPath);

    const result = await cloudinary.uploader.upload(uploadPath, {
      folder: "posts",
    });
    post.image = result.secure_url;
    fs.unlinkSync(uploadPath);
  }
  await post.save();
  res.status(StatusCodes.OK).json({ msg: "Gönderi güncellendi", post });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) throw new BadRequestError("Gönderici bulunamadı");
  if (post.author.toString() !== req.user.userId)
    throw new UnauthenticatedError("Bu gönderiyi silme yetkiniz yok");
  await post.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Gönderi silindi." });
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
};
