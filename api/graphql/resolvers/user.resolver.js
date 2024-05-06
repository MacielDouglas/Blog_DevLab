import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userResolver = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        const user = await User.findById(id).exec();
        return user;
      } catch (error) {
        throw new Error(`Erro ao buscar usuário: ${error.message}`);
      }
    },

    loginUser: async (_, { email, password }, { res }) => {
      try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) throw new Error("Credenciais inválidas.");

        const senha = await bcrypt.compare(password, user.password);

        if (!senha) throw new Error("Credenciais inválidas...");

        const token = jwt.sign(
          { userId: user.id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        console.log("Token: ", token);
        const { password: _, ...userWithoutPassword } = user._doc;
        res.cookie("access_token", token, {
          httpOnly: true,
        });

        return {
          token,
          id: user.id,
          isAdmin: user.isAdmin,
          username: user.username,
          profilePicture: user.profilePicture,
        };
      } catch (error) {
        throw new Error(`Erro ao fazer o login: ${error.message}`);
      }
    },

    logoutUser: (_, __, { res }) => {
      try {
        res.clearCookie("access_token");
        return {
          success: true,
          message: "O usuário foi desconectado com sucesso!!!",
        };
      } catch (error) {
        throw new Error(`Erro ao desconectar o usuário: ${error.message}`);
      }
    },
  },
};

export default userResolver;
