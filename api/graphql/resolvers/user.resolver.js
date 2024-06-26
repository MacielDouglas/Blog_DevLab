import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const verifyAuthorization = (req) => {
  const authorizationHeader = req.headers.cookie;
  if (!authorizationHeader) {
    throw new Error("Token de autorização não fornecido.");
  }

  const token = authorizationHeader
    .split("access_token=")[1]
    .split("; loginUser=")[0];

  if (!token) {
    throw new Error("Token de autorização inválido.");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken;
};

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
        const { password: _, ...userWithoutPassword } = user._doc;

        res.cookie("access_token", token, {
          httpOnly: true,
        });

        return {
          id: user.id,
          isAdmin: user.isAdmin,
          username: user.username,
          profilePicture: user.profilePicture,
          name: user.name,
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

  Mutation: {
    createUser: async (_, { user }) => {
      try {
        const existingEmail = await User.findOne({ email: user.email });
        if (existingEmail)
          throw new Error(
            `Este email está em uso. Por favor, use outro email.`
          );

        const existingUsername = await User.findOne({
          username: user.username,
        });
        if (existingUsername)
          throw new Error(
            `Este usuário está em uso. Por favor escolha outro nome de usuário.`
          );

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const photo =
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

        const newUser = new User({
          ...user,
          password: hashedPassword,
          profilePicture: photo,
        });
        await newUser.save();
        return newUser;
      } catch (error) {
        throw new Error(`Erro ao criar usuário: ${error.message}`);
      }
    },
    loginGoogle: async (_, { user }, { res }) => {
      const { email, displayName, profilePicture } = user;

      try {
        const existUser = await User.findOne({ email: email });

        if (!existUser) {
          const generatePassword =
            Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);

          const hashedPassword = bcrypt.hashSync(generatePassword, 10);

          const newUser = new User({
            username:
              displayName.toLowerCase().split(" ").join(".") +
              Math.random().toString(9).slice(-4),
            email,
            name: displayName,
            password: hashedPassword,
            profilePicture: profilePicture,
          });
          await newUser.save();
        }

        const user = await User.findOne({ email: email });
        const token = jwt.sign(
          {
            userId: user.id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.cookie("access_token", token, {
          httpOnly: true,
        });
        return {
          id: user.id,
          isAdmin: user.isAdmin,
          username: user.username,
          profilePicture: user.profilePicture,
          name: user.name,
        };
      } catch (error) {
        throw new Error(`Erro ao fazer login com Google: ${error.message}`);
      }
    },

    deleteUser: async (_, { id }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);

        if (!decodedToken) {
          throw new Error("Você não tem permissão para excluir este post.");
        }

        const existingUser = await User.findById(id);
        if (!existingUser) {
          throw new Error("Usuário não encontrado.");
        }
        await User.findByIdAndDelete(id);

        return {
          success: true,
          message: `Usuário: ${existingUser.username}, foi excluído com sucesso.`,
        };
      } catch (error) {
        throw new Error(`Erro ao excluir usuário: ${error.message}`);
      }
    },

    updateUser: async (_, { id, updatedUser }, { req }) => {
      try {
        const existingUser = await User.findById(id);
        if (!existingUser) throw new Error("Usuário não encontrado.");

        const decodedToken = verifyAuthorization(req);
        if (!decodedToken || decodedToken.userId !== existingUser.id) {
          throw new Error("Você não tem permissão para alterar este usuário.");
        }

        const userUpdate = {};
        const { username, email, password, profilePicture } = updatedUser;

        if (password && password.trim() !== "") {
          const hashedPassword = await bcrypt.hash(updatedUser.password, 10);
          userUpdate.password = hashedPassword;
        } else {
          userUpdate.password = existingUser.password;
        }

        if (username && username.trim() !== "") {
          userUpdate.username = username;
        } else {
          userUpdate.username = existingUser.username;
        }

        if (email && email.trim() !== "") {
          userUpdate.email = email;
        } else {
          userUpdate.email = existingUser.email;
        }
        if (profilePicture && profilePicture.trim() !== "") {
          userUpdate.profilePicture = profilePicture;
        } else {
          userUpdate.profilePicture = existingUser.profilePicture;
        }
        const novo = await User.findByIdAndUpdate(id, userUpdate);

        return {
          username: novo.username,
          email: novo.email,
          isAdmin: novo.isAdmin,
          password: novo.password,
          success: true,
          message: "Usuário atualizado com sucesso.",
        };
      } catch (error) {
        throw new Error(`Erro ao atualizar usuário: ${error.message}`);
      }
    },
  },
};

export default userResolver;
