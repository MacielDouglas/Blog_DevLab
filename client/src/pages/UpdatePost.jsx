import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./../firebase";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { useMutation, useQuery, gql } from "@apollo/client";

import { useAuth } from "../hooks/AuthProvider";
import { ONE_POST } from "../graphql/queries/post.query";
import { UPDATE_POST } from "../graphql/mutation/post.mutation";

export default function UpdatePost({ postSlug }) {
  const { user, uniqueCategories, refetchAllPosts } = useAuth();
  const { data } = useQuery(ONE_POST, {
    variables: { slug: postSlug },
  });

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    if (data?.getPosts?.length > 0) {
      const post = data.getPosts[0];
      setFormData({
        title: post.title,
        category: post.category,
        image: post.image,
        content: post.content,
      });
    }
  }, [data]);

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const editorRef = useRef(null);

  const [updatePost, { loading }] = useMutation(UPDATE_POST, {
    onCompleted: async (data) => {
      if (data) {
        await refetchAllPosts();
      }
      navigate(`/post/${data.updatePost.slug}`);
    },
    onError: (error) => {
      setErrorMessage(
        `Não foi possível enviar essa postagem: ${error.message}`
      );
    },
  });

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Por favor adicione uma imagem.");
      return;
    }
    try {
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "_" + file.name;
      const storageRef = ref(storage, fileName);
      const metadata = {
        contentType: file.type,
        customMetadata: {
          userId: user.id,
        },
      };
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Falha no envio da imagem: " + error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadProgress(null);
            setFormData((prevFormData) => ({
              ...prevFormData,
              image: downloadUrl,
            }));
          });
        }
      );
    } catch (error) {
      setImageUploadError(error.message);
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.category ||
      !formData.content ||
      !formData.image
    ) {
      setPublishError("Por favor, preencha todos os campos");
      return;
    }
    try {
      await updatePost({
        variables: {
          updatePostId: data.getPosts[0].id,
          updatedPost: { ...formData },
        },
      });
    } catch (error) {
      setPublishError(error.message);
    }
  };

  const handleChange = (content, _, source) => {
    if (source === "user") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        content,
      }));
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto mb-10">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Alterando uma postagem.
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between">
          <input
            type="text"
            placeholder="Titulo"
            required
            id="title"
            value={formData.title}
            className="rounded-lg p-3 w-full"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <div className="flex flex-row sm:flex-row gap-4 flex-wrap items-center">
            Categoria:
            {uniqueCategories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={formData.category === `${category}`}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="mr-1"
                />
                {category}
              </label>
            ))}
            <label className="flex items-center">
              Custom:
              <input
                type="text"
                name="customCategory"
                className="p-1 rounded-lg ml-2"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-4 border-stone-500 border-dotted p-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full sm:w-auto"
          />
          <button
            type="button"
            className="bg-base_04 p-2 text-base_03 rounded-lg w-full sm:w-auto mt-3 sm:mt-0"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16 mx-auto">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Carregar imagem"
            )}
          </button>
        </div>
        {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          ref={editorRef}
          theme="snow"
          value={formData.content}
          placeholder="escreva algo..."
          className="min-h-72 bg-white"
          required
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-base_03 p-3 rounded-lg text-base_04 mx-auto w-full sm:w-96 hover:text-white border border-transparent hover:border-white mt-5"
          disabled={loading}
        >
          Publicar
        </button>
        {publishError && <p className="text-red-600">{publishError}</p>}
        {errorMessage && (
          <p className="text-xl font-bold text-red-700">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
