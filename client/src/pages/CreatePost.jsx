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
import { useMutation } from "@apollo/client";
import { NEW_POST } from "../graphql/mutation/post.mutation";
import { useAuth } from "../hooks/AuthProvider";
import { gql, useApolloClient } from "@apollo/client";

export default function CreatePost() {
  const { user, uniqueCategories, refetchAllPosts } = useAuth();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    userId: user.id,
    writer: user.username,
    title: "",
    content: "",
    image: "",
    category: "",
  });
  const [publishError, setPublishError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const client = useApolloClient();

  // Ref para o editor ReactQuill
  const editorRef = useRef(null);

  const [newPost, { loading }] = useMutation(NEW_POST, {
    onCompleted: async (data) => {
      if (data.createPost.slug) {
        await refetchAllPosts();
        navigate(`/post/${data.createPost.slug}`);
      }
    },
    onError: (error) => {
      setErrorMessage(
        `Não foi possível enviar essa postagem: ${error.message}`
      );
    },
  });

  const handleUploadImage = async () => {
    try {
      if (!file) {
        throw new Error("Por favor adicione uma imagem.");
      }
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
      // const uploadTask = uploadBytesResumable(storageRef, file);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          throw new Error("Falha no envio da imagem: " + error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadUrl });
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
    try {
      if (
        !formData.title ||
        !formData.category ||
        !formData.content ||
        !formData.image
      ) {
        throw new Error("Por favor, preencha todos os campos");
      }
      setFormData({ ...formData, userId: user.id });
      await newPost({ variables: { newPost: formData } });
    } catch (error) {
      setPublishError(error.message);
    }
  };

  const handleChange = (content, _, source) => {
    if (source === "user") {
      setFormData({ ...formData, content });
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {});
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // console.log("Form.. ", formData);
  return (
    <div className="p-3 max-w-3xl mx-auto mb-10">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Criando uma nova postagem.
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between">
          <input
            type="text"
            placeholder="Titulo"
            required
            id="title"
            className="rounded-lg p-3"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <div className="flex flex-row gap-4 flex-wrap items-center">
            Categoria:
            {uniqueCategories.map((category) => (
              <label key={category}>
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={formData.category === `${category}`}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
                {category}
              </label>
            ))}
            <label>
              Custom:
              <input
                type="text"
                name="customCategory"
                className="p-1 rounded-lg"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </label>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-stone-500 border-dotted p-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="button"
            className="bg-base_04 p-2 text-base_03 rounded-lg"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
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
          placeholder="escreva algo..."
          className="min-h-72 bg-white"
          required
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-base_03 p-3 rounded-lg text-base_04 mx-auto w-96 hover:text-white border border-transparent hover:border-white mt-5"
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
