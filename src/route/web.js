import express from "express";
const multer = require("multer");
import ProductControler from "../controllers/ProductControler";
import UserControler from "../controllers/UserControler";
import BrandControler from "../controllers/BrandControler";
import CategoryControler from "../controllers/CategoryControler";
import CommentControler from "../controllers/CommentControler";
import RoleControler from "../controllers/RoleControler";
import OrderControler from "../controllers/OrderControler";
import BlogControler from "../controllers/BlogControler";
import WarehouseControler from "../controllers/WarehouseControler";
import OptionControler from "../controllers/OptionControler";
let router = express.Router();
const { upload } = require("../Services/ProductService");

let initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.send("Hello world");
  });
  //product
  router.get("/api/get-all-product", ProductControler.handlegetallProduct);
  router.get("/api/get-product/:id/", ProductControler.handlegetbyidProduct);
  router.get(
    "/api/find-by-brand/:brand_id/",
    ProductControler.handlegetProductByBrand
  );
  router.get(
    "/api/find-by-Category/:category_id/",
    ProductControler.handleFindProductByCategory
  );
  router.post("/api/create-Product/", ProductControler.handleCreateProduct);
  router.put("/api/update-Product/", ProductControler.handleUpdateProduct);
  router.get(
    "/api/findbykeyword/:keyword/",
    ProductControler.getProductByKeyword
  );
  router.post(
    "/api/create-img-product",
    upload.single("file"),
    ProductControler.handleUploadImg
  );
  router.delete(
    "/api/delete-product/:id/",
    ProductControler.handleDeleteProduct
  );
  //Option
  router.post("/api/create-option", OptionControler.handleCreateOption);
  router.delete("/api/delete-option/:id/", OptionControler.handleDeleteOption);
  //brand
  router.get("/api/get-brand/", BrandControler.handleGetAllBrand);
  router.post("/api/get-create-brand/", BrandControler.handleCreateBrand);
  router.put("/api/update-brand/", BrandControler.handleUpdateBrand);
  router.delete("/api/delete-brand/:id/", BrandControler.handleDeleteBrand);
  //Category
  router.get("/api/get-Category/", CategoryControler.handleGetAllCategory);
  router.post(
    "/api/get-create-Category/",
    CategoryControler.handleCreateCategory
  );
  router.put("/api/update-Category/", CategoryControler.handleUpdatCategory);
  router.delete(
    "/api/delete-Category/:id/",
    CategoryControler.handleDeleteCategory
  );
  //Category blog
  //comment
  router.get(
    "/api/get-comment-of-product/:id/",
    CommentControler.handleGetAllCommentOfProductRate
  );
  router.post("/api/add-comment/", CommentControler.handleAddComment);
  router.put("/api/update-comment/", CommentControler.handleUpdateComment);
  router.delete(
    "/api/delete-comment/:id/",
    CommentControler.handleDeleteComment
  );
  //commentblog

  //user
  router.get("/api/get-all-user/", UserControler.handleGetAllUser);
  router.get("/api/get-by-Id/:id/", UserControler.handleGetById);
  router.post("/api/sign-up-user/", UserControler.handleSignUp);
  router.get("/api/get-user-login/", UserControler.handleLogin);
  router.put("/api/update-user/", UserControler.handleUpdateUser);
  //Role
  router.get("/api/get-all-role/", RoleControler.handleGetAllRole);
  router.get(
    "/api/get-all-user-by-role/:id/",
    RoleControler.handleGetUserByRole
  );
  router.post("/api/create-role/", RoleControler.handleCreateRole);
  router.delete("/api/delete-role/:id/", RoleControler.handlDeleteRole);
  //Order
  router.get("/api/get-all-order/", OrderControler.handleGetAllOrder);
  router.get(
    "/api/get-all-order-by-status/:status/",
    OrderControler.handleAllOrderByStatus
  );
  router.post(
    "/api/create-order-user/",
    OrderControler.handleGetCreateOrderByUser
  );
  router.get(
    "/api/get-order-by-user/:id/",
    OrderControler.handleGetAllOrderByUser
  );
  //Blog
  router.get("/api/get-all-blog/", BlogControler.handleGetAllBlog);
  router.get(
    "/api/get-all-blog-by-catergory-blog/:id/",
    BlogControler.handleGetAllBlogByCategory
  );
  router.post("/api/create-blog/", BlogControler.handleCreateBlog);
  router.put("/api/update-blog/", BlogControler.handleUpdateBlog);
  router.delete("/api/delete-blog/:id/", BlogControler.handleDeleteBlog);

  //warehouse
  router.get("/api/get-warehouse/", WarehouseControler.handleGetAllWarehouse);
  router.post(
    "/api/create-warehouse/",
    WarehouseControler.handleCreateWarehouse
  );
  router.put(
    "/api/update-warehouse/",
    WarehouseControler.handleUpdateWarehouse
  );
  router.delete(
    "/api/delete-warehouse/:id/",
    WarehouseControler.handleDeleteWarehouse
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;
