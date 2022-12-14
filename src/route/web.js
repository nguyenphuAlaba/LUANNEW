import express from "express";
const multer = require("multer");
import ProductControler from "../controllers/ProductControler";
import UserControler from "../controllers/CustomerControler";
import BrandControler from "../controllers/BrandControler";
import CategoryControler from "../controllers/CategoryControler";
import CommentControler from "../controllers/CommentControler";
import RoleControler from "../controllers/RoleControler";
import OrderControler from "../controllers/OrderControler";
import BlogControler from "../controllers/BlogControler";
import WarehouseControler from "../controllers/WarehouseControler";
import WarrantyControler from "../controllers/WarrantyControler";
import CartControler from "../controllers/CartControler";
import EventControler from "../controllers/EventControler";
let router = express.Router();
const { upload } = require("../Services/ProductService");

let initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.send("Hello world");
  });
  //product
  router.get(
    "/api/get-all-product-admin/",
    ProductControler.handleGetAllProductadmin
  );
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
  router.put(
    "/api/add-product-quantity-in-warehouse/",
    ProductControler.handleUpdateAmountProductWarehouse
  );
  router.post(
    "/api/add-too-wish-list/",
    ProductControler.handleAddProductWishlist
  );
  router.get(
    "/api/get-all-product-by-cus/:cus_id/",
    ProductControler.handleGetAllProductWislishByCusID
  );
  router.delete(
    "/api/delete-wishlist/:wishlist_id/",
    ProductControler.handleDeleteProductinWishlist
  );
  router.post("/api/add-to-view/", ProductControler.handleAddProductView);
  router.get(
    "/api/get-product-view-by-customer-id/:cus_id/",
    ProductControler.handleGetAllProductView
  );
  router.post(
    "/api/create-option-product",
    ProductControler.handleCreateOptionProduct
  );
  router.put(
    "/api/update-option-product",
    ProductControler.handleUpdateOptionProduct
  );
  router.delete(
    "/api/delete-option-product/:optionid/",
    ProductControler.handleDeleteOption
  );
  router.get(
    "/api/get-option-product/",
    ProductControler.handleGetAllOptionProduct
  );
  router.get("/api/get-option/", ProductControler.handleGetOption);
  router.post(
    "/api/create-warehouse-product/",
    ProductControler.handleCreateWareHouseProduct
  );
  router.post("/api/create-option/", ProductControler.handleCreateOpttion);
  router.post(
    "/api/get-product-quantity/",
    ProductControler.handleGetWarehouseQuantity
  );
  router.put(
    "/api/delete-product-soft/:productId/",
    ProductControler.handleDeleteProductbystatus
  );
  //Cart
  router.post("/api/add-to-cart", CartControler.handleAddProductToCart);
  router.get("/api/get-all-cart", CartControler.handleGetAllCat);
  router.get(
    "/api/get-cart-by-customer-id/:id/",
    CartControler.handleGetCartByCustomer
  );
  router.put("/api/update-amount-cart", CartControler.handleUpdateAmount);
  router.put("/api/plusminus-amount", CartControler.handlPlusMinusAmount);
  router.delete(
    "/api/handle-Delete-Cartitem/:cart_id/",
    CartControler.handleDeleteCartitem
  );
  router.delete(
    "/api/handle-Delete-All-Cartitem/:cart_id/",
    CartControler.handleDeleteAllCartitem
  );
  //Warranty
  router.get("/api/get-all-warranty/", WarrantyControler.handleGetAllWarranty);
  router.get(
    "/api/get-detail-warranty/:warrantyId/",
    WarrantyControler.handlGetDetailWarranty
  );
  router.post("/api/create-warranty/", WarrantyControler.handleCreateWarranty);
  router.put("/api/update-warranty/", WarrantyControler.handleUpdateWarranty);
  router.get(
    "/api/get-all-warranty-by-cus/:cusId/",
    WarrantyControler.handleWarrantyByCus
  );
  router.get(
    "/api/get-all-warranty-info/:storeId/",
    WarrantyControler.handleGetwarrantyInfor
  );

  //store
  router.get("/api/get-all-store/", WarrantyControler.handleGetAllStore);

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
  router.get("/api/get-category-parent/", CategoryControler.handleGetCategory);
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
  router.get("/api/get-all-comment/", CommentControler.handleGetAllComment);
  router.get(
    "/api/get-all-comment-customer/:cusId/",
    CommentControler.handleGetCommentCustomer
  );
  router.get(
    "/api/get-all-comment-admin/",
    CommentControler.handleGetAllCommentResponsesAdmin
  );
  //-----Comment Response -----------
  router.post(
    "/api/create-comment-response/",
    CommentControler.handleCreateCommentResponse
  );
  router.get(
    "/api/get-comment-respone/:commentId/",
    CommentControler.handleGetAllCommentResponses
  );
  router.put(
    "/api/update-comment-respone/",
    CommentControler.handleUpdateCommentResponse
  );
  router.delete(
    "/api/delete-comment-respone/:commentId/",
    CommentControler.handleDeleteCommentResponse
  );
  //commentblog

  //user
  router.get("/api/get-all-user/", UserControler.handleGetAllUser);
  router.get("/api/get-by-Id/:id/", UserControler.handleGetById);
  router.post("/api/sign-up-user/", UserControler.handleSignUp);
  router.post("/api/get-user-login/", UserControler.handleLogin);
  router.put("/api/update-user/", UserControler.handleUpdateUser);
  router.put("/api/udate-password/", UserControler.handleChangePassword);
  router.post("/api/forgot-password/", UserControler.handleForgetPassWord);
  router.post("/api/login-admin/", UserControler.handleLoginAdmin);
  router.get("/api/get-all-staff/", UserControler.handleGetAllStaff);
  router.get(
    "/api/get-all-order-in-warehouse/",
    UserControler.handleGetAllOrderInWarehouse
  );
  router.put("/api/forgot-password/", UserControler.handleResetPassword);
  router.put("/api/acctive-user-account/:userId/", UserControler.handleAcctive);
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
  router.get("/api/Count-Order-chart/", OrderControler.handleCountOrder);
  router.get(
    "/api/get-all-order-in-month/",
    OrderControler.handleOrderFormMonth
  );
  router.post(
    "/api/create-order-user/",
    OrderControler.handleGetCreateOrderByUser
  );
  router.post(
    "/api/create-order-direct/",
    OrderControler.handleCreateOrderDirectPayment
  );
  router.get(
    "/api/get-order-by-user/:id/",
    OrderControler.handleGetAllOrderByUser
  );
  router.post(
    "/api/get-order-by-user-status/",
    OrderControler.handleGetAllOrderByUserAndStatus
  );
  router.get(
    "/api/get-all-order-status-1/",
    OrderControler.handleGetAllOrdersta1
  );
  router.delete(
    "/api/delete-order-by-Oder-id/:order_id/",
    OrderControler.handleDeleteOrder
  );
  router.post("/api/get-momo-payment-link/", OrderControler.getMomoPaymentLink);
  router.post("/api/handle-order/", OrderControler.handleOrderPayment);
  router.post("/api/test-query/", OrderControler.handleTestQuery);
  // ORDER UPDATE
  router.put(
    "/api/update-accept-order/:orderId/",
    OrderControler.handleUpdateOrderStatus
  );
  router.put(
    "/api/update-order-status-3/:orderId/",
    OrderControler.handleUpdateOrderStatus3
  );
  router.put(
    "/api/update-order-status-4/:orderId/",
    OrderControler.handleUpdateOrderStatus4
  );
  router.put("/api/cancel-order/:orderId/", OrderControler.handleCancelOrder);
  router.get(
    "/api/get-order-detail/:orderId/",
    OrderControler.handleGetDetailProduct
  );
  router.get(
    "/api/get-count-order-status/",
    OrderControler.handleCountOrderStatus1
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
  router.get(
    "/api/Get-all-warehouse/",
    WarehouseControler.handleGetAllProductInWarehouse
  );
  router.get("/api/get-all-event/", EventControler.handleGetAllEvent);
  router.post("/api/create-event/", EventControler.handleCreateEvent);
  router.put("/api/update-event/", EventControler.handleUpdateEvent);
  router.delete(
    "/api/delete-event/:eventId/",
    EventControler.handleDeleteEvent
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;
