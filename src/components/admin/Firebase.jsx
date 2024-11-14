import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
const Firebase = () => {
  const [loading, setloading] = useState();
  const [url, seturl] = useState();

  const uploadFile = async (event) => {
    if (!event.target.files[0]) return;
    if (
      !["jpg", "jpeg", "png"].includes(event.target.files[0].type.split("/")[1])
    )
      return;

    try {
      setloading("loading...");
      const imageRef = ref(storage, `images/${event.target.files[0].name}`);
      await uploadBytes(imageRef, event.target.files[0]);
      const url = await getDownloadURL(imageRef);
      seturl(url);
    } catch (err) {
      console.log(err);
      setloading("something went wrong");
    } finally {
      setloading("uploaded successfully");
      setTimeout(() => {
        setloading("preview");
      }, 2000);
    }
  };
  return (
    <div>
      <input type="file" onChange={uploadFile} />
      <button onClick={uploadFile}>Upload</button>
      <h1>{loading}</h1>
      <img width={300} src={url} alt="" />
    </div>
  );
};

export default Firebase;
