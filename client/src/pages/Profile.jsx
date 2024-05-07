export default function Profile() {
  const handleImageChange = (e) => {
    console.log("IMAGE");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Perfil</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input de arquivo para selecionar uma nova imagem de perfil */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          //   ref={filePickerRef}
          hidden
        />
        {/* Preview da imagem de perfil atual ou selecionada */}
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          //   onClick={() => filePickerRef.current.click()}
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
            src={imageFileUrl || currentUser.profilePicture}
            alt="imagem do usuário"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {/* Exibe mensagem de erro de upload, se houver */}
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {/* Campos de entrada para nome de usuário, e-mail e senha */}
        <TextInput
          type="text"
          id="username"
          placeholder="usuário"
          value={formState.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          value={formState.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="senha"
          onChange={handleChange}
        />
        {/* Botão para enviar o formulário de edição do perfil */}
        <Button
          type="submit"
          color="dark"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Carregando..." : "Alterar"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button type="button" color="dark" className="w-full">
              Crie uma postagem
            </Button>
          </Link>
        )}
      </form>
    </div>
  );
}
