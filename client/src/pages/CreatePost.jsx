import { useState } from "react";
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

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Por favor adicione uma imagem.");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "_" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Falha no envio da imagem.");
          setImageUploadProgress(null);
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
      setImageUploadError("Falha ao carregar a imagem.");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submetido");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Criando uma nova postagem.
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Input para o título e seleção da categoria */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Titulo"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <div className="flex flex-row gap-4 flex-wrap">
            <label>
              <input
                type="radio"
                name="category"
                value="javascript"
                checked={formData.category === "javascript"}
                onChange={handleChange}
              />
              JavaScript
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="reactjs"
                checked={formData.category === "reactjs"}
                onChange={handleChange}
              />
              React JS
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="nextjs"
                checked={formData.category === "nextjs"}
                onChange={handleChange}
              />
              Next JS
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="custom"
                checked={formData.category === "custom"}
                onChange={handleChange}
              />
              Custom:
              <input
                type="text"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        {/* Input para selecionar a imagem */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="button"
            color="dark"
            size="sm"
            // outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                carregando
                {/* <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                /> */}
              </div>
            ) : (
              "Carregar imagem"
            )}
          </button>
        </div>
        {/* Exibe mensagem de erro de upload, se houver */}
        {/* {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>} */}
        {/* Exibe a imagem carregada */}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        {/* Editor de texto para escrever o conteúdo da postagem */}
        <ReactQuill
          theme="snow"
          placeholder="escreva algo..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        {/* Botão para enviar o formulário */}
        <button type="submit" color="dark">
          Publicar
        </button>
        {/* {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )} */}
      </form>
    </div>
  );
}
