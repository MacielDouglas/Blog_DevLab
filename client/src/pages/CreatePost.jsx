import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    console.log("Upload Image");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Selecione uma categoria</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React JS</option>
            <option value="nextjs">Next JS</option>
          </select>
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
