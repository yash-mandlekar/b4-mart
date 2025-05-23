import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
import "../../Css/AdminProduct.css";
import { notify } from "../common/Toast";
import { useDispatch, useSelector } from "react-redux";
import {
  asynallproducts,
  asynccreateproduct,
  asyncremoveproduct,
  asynsingleshopproducts,
} from "../../store/userActions";
const Products = () => {
  const dispatch = useDispatch();
  const { user, products, singleshop_products } = useSelector(
    (state) => state.user
  );
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    description: "",
    price: "",
    stocks: "",
    quantity: "",
    quantity_type: "",
    discount: "",
  });
  const [firemsg, setfiremsg] = useState();
  const [preview, setpreview] = useState([]);
  const {
    product_name,
    category,
    description,
    price,
    stocks,
    quantity,
    quantity_type,
    discount,
  } = form;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const uploadFiles = async (event, i) => {
    if (!event.target.files[i]) return;
    if (
      !["jpg", "jpeg", "png"].includes(event.target.files[i].type.split("/")[1])
    )
      return notify("File type is not valid");
    try {
      setfiremsg("loading...");
      const imageRef = ref(storage, `products/${event.target.files[i].name}`);
      await uploadBytes(imageRef, event.target.files[i]);
      const url = await getDownloadURL(imageRef);

      setpreview((prev) => [...prev, url]);
    } catch (err) {
      console.log(err);
      setfiremsg("something went wrong");
    } finally {
      setfiremsg("uploaded successfully");
      setTimeout(() => {
        setfiremsg("Preview:");
      }, 2000);
    }
  };

  const handleFileChange = (event) => {
    if ((event.target.files.length < 6) & (preview.length < 5)) {
      for (let i = 0; i < event.target.files.length; i++) {
        uploadFiles(event, i);
      }
    } else {
      notify("You can upload only 5 files");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(preview);
    if (preview.length < 1) {
      notify("Please upload at least one image");
      return;
    }
    const formData = new FormData();
    formData.append("product_name", product_name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("quantity_type", quantity_type);
    formData.append("stocks", stocks);
    formData.append("discount", discount || 0);
    formData.append("productpic", preview);
    dispatch(asynccreateproduct(formData));
    setForm({
      product_name: "",
      category: "",
      description: "",
      price: "",
      quantity: "",
      quantity_type: "",
      stocks: "",
      discount: "",
    });
    document.querySelector('input[type="file"]').value = "";
    setpreview([]);
  };

  useEffect(() => {
    dispatch(asynsingleshopproducts(user?._id));
  }, [products]);
  return (
    <div className="covermain">
      <div className="productManagement">
        <h1 className="productManagement__title">Product Management</h1>
        <form className="productManagement__form" onSubmit={handleSubmit}>
          <input
            name="product_name"
            type="text"
            placeholder="Product Name"
            value={product_name}
            onChange={handleChange}
            required
            className="productManagement__input"
          />
          <select
            name="category"
            value={category}
            onChange={handleChange}
            required
            className="productManagement__select"
          >
            <option value="">Select Category</option>
            <option value="Paan Corner">Paan Corner</option>
            <option value="Dairy, Bread & Eggs">Dairy, Bread & Eggs</option>
            <option value="Fruits & Vegetables">Fruits & Vegetables</option>
            <option value="Cold Drinks & Juices">Cold Drinks & Juices</option>
            <option value="Snacks & Munchies">Snacks & Munchies</option>
            <option value="Breakfast & Instant Food">
              Breakfast & Instant Food
            </option>
            <option value="Sweet Tooth">Sweet Tooth</option>
            <option value="Bakery">Bakery</option>
            <option value="Tea, Coffee & Health Drink">
              Tea, Coffee & Health Drink
            </option>
            <option value="Atta, Rice & Dal">Atta, Rice & Dal</option>
            <option value="Masala, Oil & More">Masala, Oil & More</option>
            <option value="Sauces & Spreads">Sauces & Spreads</option>
            <option value="Chicken, Meat & Fish">Chicken, Meat & Fish</option>
            <option value="Organic & Healthy Living">
              Organic & Healthy Living
            </option>
            <option value="Baby Care">Baby Care</option>
            <option value="Pharma & Wellness">Pharma & Wellness</option>
            <option value="Cleaning Essentials">Cleaning Essentials</option>
            <option value="Home & Office">Home & Office</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Pet Care">Pet Care</option>
          </select>
          <textarea
            name="description"
            placeholder="Product Description"
            value={description}
            onChange={handleChange}
            required
            className="productManagement__textarea"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={price}
            onChange={handleChange}
            required
            className="productManagement__input"
          />
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={handleChange}
            required
            className="productManagement__input"
          />
          <select
            name="quantity_type"
            value={quantity_type}
            onChange={handleChange}
            required
            className="productManagement__select"
          >
            <option value="">Select Quantity Type</option>
            <option value="peice">Peice (peice) </option>
            <option value="kg">Kilogram (kg) </option>
            <option value="g">Gram (g) </option>
            <option value="l">Liters (l) </option>
            <option value="ml">Millilitre (ml) </option>
          </select>
          <input
            name="stocks"
            type="number"
            placeholder="Stocks"
            value={stocks}
            onChange={handleChange}
            required
            className="productManagement__input"
          />
          <sub>Only 5 images are allowed</sub>
          <input
            type="file"
            name="photo"
            placeholder="Product Photo URL"
            onChange={handleFileChange}
            multiple
            className="productManagement__input"
          />
          <p>{firemsg}</p>
          <div className="flex">
            {preview.map((item, i) => (
              <img key={i} src={item} alt="" />
            ))}
          </div>
          <input
            name="discount"
            type="number"
            placeholder="Discount (%)"
            value={discount}
            onChange={handleChange}
            className="productManagement__input"
          />
          <button type="submit" className="productManagement__button">
            Add Product
          </button>
        </form>

        <h2 className="productManagement__listTitle">Product List</h2>
        <table className="productManagement__table">
          <thead>
            <tr>
              <th className="productManagement__tableHeader">Photo</th>
              <th className="productManagement__tableHeader">Product Name</th>
              <th className="productManagement__tableHeader">Category</th>
              <th className="productManagement__tableHeader">Quantity</th>
              <th className="productManagement__tableHeader">Type</th>
              <th className="productManagement__tableHeader">Discount</th>
              <th className="productManagement__tableHeader">Price </th>
              <th className="productManagement__tableHeader">Action </th>
            </tr>
          </thead>
          <tbody>
            {singleshop_products?.map((product, i) => (
              <tr key={i}>
                <td className="productManagement__tableData">
                  <img
                    src={product?.productpic}
                    alt={product?.product_name}
                    width="50"
                    className="productManagement__image"
                  />
                </td>
                <td className="productManagement__tableData">
                  {product?.product_name}
                </td>
                <td className="productManagement__tableData">
                  {product?.category}
                </td>
                <td className="productManagement__tableData">
                  {product?.quantity}
                </td>
                <td className="productManagement__tableData">
                  {product?.quantity_type}
                </td>
                <td className="productManagement__tableData">
                  {product?.discount}%
                </td>
                <td className="productManagement__tableData">
                  ₹ {product?.price}
                </td>
                <td className="productManagement__tableData">
                  <button
                    onClick={() => dispatch(asyncremoveproduct(product?._id))}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
