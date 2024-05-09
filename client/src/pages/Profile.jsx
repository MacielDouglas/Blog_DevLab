import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useMutation } from "@apollo/client";
import { DELETE_USER, UPDATE_USER } from "../graphql/mutation/user.mutation";

export default function Profile() {
  const { user, logOff } = useAuth();
  const [updateUser, { loading }] = useMutation(UPDATE_USER);
  const [id] = useMutation(DELETE_USER);
  const [showModal, setShowModal] = useState(false);

  const [formState, setFormState] = useState({
    username: user.username,
    password: "",
    profilePicture: user.profilePicture,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  // Estados para mensagens de sucesso e erro durante a atualização do usuário e modal
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const filePickerRef = useRef();

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // Função para upload da imagem para o Firebase Storage
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // Evento para acompanhar o progresso do upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Não foi possível fazer upload da imagem (o arquivo deve ter menos de 2 MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        // Upload concluído com sucesso
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setImageFileUploadProgress(100);
          setImageFileUploading(false);
          setFormState({ ...formState, profilePicture: downloadUrl });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  // Função para lidar com o envio do formulário de atualização do usuário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formState).length === 0) {
      setUpdateUserError("Nenhuma alteração foi feita");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Aguarde o upload da imagem");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `${token}`,
      };

      // Envie os dados do formulário junto com o cabeçalho de autorização
      const { data } = await updateUser({
        variables: { updateUserId: user.id, updatedUser: formState },
        context: {
          headers,
        },
      });

      // Manipule a resposta conforme necessário
      console.log("Dados atualizados:", data);
      setUpdateUserSuccess("Perfil atualizado com sucesso!");
    } catch (error) {
      setUpdateUserError(error.message);
    }
  };

  const handleDelete = async () => {
    setShowModal(false);
    // window.confirm("Tem certeza?");
    try {
      const { data } = await id({
        variables: { deleteUserId: user.id },
      });

      logOff();
      navigate("/");
      // setShowModal(true);
      window.alert(data.deleteUser.message);
    } catch (error) {
      console.error(error.message);
    }
  };

  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Perfil</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input de arquivo para selecionar uma nova imagem de perfil */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        {/* Preview da imagem de perfil atual ou selecionada */}
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {/* Barra de progresso circular para exibir o progresso do upload */}
          {imageFileUploadProgress > 0 && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          {/* Imagem de perfil atual ou a imagem selecionada */}
          <img
            src={imageFileUrl || user.profilePicture}
            alt="imagem do usuário"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {/* Exibe mensagem de erro de upload, se houver */}
        {imageFileUploadError && <p color="failure">{imageFileUploadError}</p>}
        {/* Campos de entrada para nome de usuário, e-mail e senha */}
        <input
          type="text"
          id="username"
          placeholder="usuário"
          className="p-2 rounded-md pl-5"
          value={formState.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          className="p-2 rounded-md pl-5"
          placeholder="email"
          value={formState.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          className="p-2 rounded-md pl-5"
          placeholder="senha"
          onChange={handleChange}
        />
        {/* Botão para enviar o formulário de edição do perfil */}
        <button
          type="submit"
          className="bg-base_03 py-3  font-bold text-base_02 rounded-md hover:bg-stone-700 hover:text-stone-50"
          disabled={loading || imageFileUploading}
        >
          {loading ? "Carregando..." : "Alterar"}
        </button>
        <div className="flex justify-between mt-2 font-semibold mb-10 text-red-500">
          <p
            onClick={() => setShowModal(true)}
            className="cursor-pointer hover:text-red-800"
            disabled={loading || imageFileUploading}
          >
            Deletar Conta
          </p>
          <p
            onClick={logOff}
            className="cursor-pointer hover:text-red-800"
            disabled={loading || imageFileUploading}
          >
            Sair
          </p>
        </div>
        {user.isAdmin && (
          <Link to={"/create-post"}>
            <button type="button" color="dark" className="w-full">
              Crie uma postagem
            </button>
          </Link>
        )}
      </form>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          // onClick={toggleModal}
        >
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md flex text-center flex-col justify-around">
            <HiOutlineExclamationCircle className="h-10 sm:h-14 w-10 sm:w-14 text-gray-600 mb-2 sm:mb-4 mx-auto" />
            <h3 className="mb-3 sm:mb-5 text-base sm:text-lg text-gray-500">
              Tem certeza de que deseja excluir sua conta?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDelete}
                className="bg-red-500 p-2 sm:p-3 rounded-md text-red-50 flex-1"
              >
                Sim, excluir!
              </button>
              <button
                className="bg-base_03 p-2 sm:p-3 rounded-md text-stone-100 flex-1 mt-2 sm:mt-0"
                onClick={() => setShowModal(false)}
              >
                Não, cancelar!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
