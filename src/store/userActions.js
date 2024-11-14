import {
  loaduser,
  errors,
  logout,
  setloadingfalse,
  setloading,
  setshops,
  setpageloading,
  setpageloadingfalse,
  createshops,
  removeshops,
  setproducts,
  removeproducts,
  createproduct,
  setsingleshop_products,
  updatecart,
  updateorders,
  updateprofile,
  updatelocation,
  updateshoporders,
} from "./UserSlice";
import Axios from "../Axios";
import { notify } from "../components/common/Toast";

export const cancelOrderAction = (orderId) => async (dispatch) => {
  try {
    const { data } = await Axios.get(`/cancel_order/${orderId}`);
    console.log("responce cancel order ", data);
  } catch (error) {
    console.error("Error cancelling order:", error);
  }
};

export const asyncloaduser = () => async (dispatch) => {
  try {
    dispatch(setpageloading());
    const { data } = await Axios.get("/me");
    if (data.success) {
      dispatch(loaduser(data.user));
      dispatch(updatecart(data.user.cart));
    }
    dispatch(setpageloadingfalse());
  } catch (err) {
    dispatch(setpageloadingfalse());
    dispatch(errors(err?.response?.data?.message));
  }
};

export const asynclogout = () => async (dispatch) => {
  try {
    dispatch(setpageloading());
    await Axios.get("/logout");
    window.localStorage.removeItem("location");
    dispatch(updatelocation(null));
    dispatch(logout());
    dispatch(setpageloadingfalse());
  } catch (err) {
    dispatch(errors(err.response.data.message));
  }
};

export const asyncadminlogin = (formdata) => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.post("/admin/login", formdata);
    if (data.success) dispatch(asyncloaduser());
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};

export const asynccreateshop = (formdata) => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.post("/admin/shop", formdata);
    dispatch(createshops(data.user));
    notify(data.message);

    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};

export const asyncremoveshop = (id) => async (dispatch) => {
  try {
    dispatch(setloading());
    await Axios.delete(`/admin/shop/${id}`);
    dispatch(removeshops(id));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};

export const asynallshops = () => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.get("/admin/shop");
    dispatch(setshops(data.shops));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};

export const asynccreateproduct = (formdata) => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.post("/admin/product", formdata);
    console.log(data);
    dispatch(createproduct(data.product));
    notify(data.message);

    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};

export const asynallproducts = () => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.get("/admin/product");
    dispatch(setproducts(data.products));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};

export const asynsingleshopproducts = (id) => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.get(`/admin/singleshop/products/${id}`);
    dispatch(setsingleshop_products(data.products));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};

export const asyncremoveproduct = (id) => async (dispatch) => {
  try {
    dispatch(setloading());
    await Axios.delete(`/admin/product/${id}`);
    dispatch(removeproducts(id));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
export const asyncaddcart = (id) => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.post(`/add_cart/${id}`);
    dispatch(updatecart(data.cart));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
export const asyncremovecart = (id) => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.post(`/remove_cart/${id}`);
    dispatch(updatecart(data.cart));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
export const asyncclearcart = () => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.get(`/user_order`);
    dispatch(updateorders(data.orders));
    dispatch(updatecart([]));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
export const asyncupdateorders = () => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.get(`/user_order`);
    dispatch(updateorders(data.orders));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
export const asyncupdateshoporders = () => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.get(`/admin/shop/orders`);
    dispatch(updateshoporders(data.data));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
export const asyncupdateorderstatus = (id, orderStatus) => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.put(`/admin/orders/${id}`, { orderStatus });
    dispatch(asyncupdateshoporders());
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
export const asyncupdateprofile = (url) => async (dispatch) => {
  try {
    dispatch(setloading());
    const { data } = await Axios.post(`/update_profile`, { url });
    dispatch(updateprofile(data.user.profilepic));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
export const asyncsetLocation = (location) => async (dispatch) => {
  try {
    dispatch(setloading());
    dispatch(updatelocation(location));
    const { data } = await Axios.post("find_shop", location);
    const profileupdate = await Axios.put("profileupdate", {
      lat: location.latitude,
      lon: location.longitude,
    });
    dispatch(setshops(data.shops));
    window.localStorage.setItem("location", JSON.stringify(location));
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
export const asyncloadlocation = () => async (dispatch) => {
  try {
    dispatch(setloading());
    const location = window.localStorage.getItem("location");
    if (location) {
      dispatch(updatelocation(JSON.parse(location)));
      const { data } = await Axios.post("find_shop", JSON.parse(location));
      dispatch(setshops(data.shops));
    }
    dispatch(setloadingfalse());
  } catch (err) {
    dispatch(errors(err?.response?.data?.message));
  }
};
