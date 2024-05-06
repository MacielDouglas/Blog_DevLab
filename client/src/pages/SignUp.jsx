import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    user: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  console.log(formData);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para autenticar o usuário com os dados do formulário
  };

  return (
    <div className="min-h-screen mt-20 pb-10">
      <div className="p-14 mx-auto sm:mx-auto max-w-96 sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-stone-50 rounded-2xl shadow-2xl ">
        <h1 className="text-center mb-8 text-3xl font-bold">Cadastre-Se</h1>
        <div className="flex flex-col  md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <h2 className="font-semibold text-2xl">DevLab, blog</h2>
            <p className="text-sm mt-3">
              Desvendando o código, libertando criatividade e construindo um
              algoritmo - uma linha de código de cada vez.
            </p>
          </div>

          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label
                  htmlFor="user"
                  className="text-gray-600 font-medium text-sm"
                >
                  Usuário
                </label>
                <input
                  type="text"
                  id="user"
                  name="user"
                  placeholder="fulano"
                  value={formData.user}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-gray-600 font-medium text-sm"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="fulano@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-gray-600 font-medium text-sm"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-base_03 text-white rounded-md py-2 px-4 hover:bg-stone-700 focus:outline-none focus:bg-blue-600"
              >
                Cadastrar
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm mt-10 sm:flex-row">
          <p>Já possui uma conta?</p>
          <Link
            to="/login"
            className="text-blue-700 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
