import Comment from "../../models/comment.models.js";
import Post from "../../models/post.models.js";
import jwt from "jsonwebtoken";
import User from "./../../models/user.model.js";

const commentResolver = {
  Query: {
    allComments: async (_, { postId }) => {
      try {
        const comments = await Comment.find({ postId }).exec();
        return comments;
      } catch (error) {
        throw new Error("Erro ao buscar comentários.");
      }
    },
  },
  Mutation: {
    createComment: async (_, { postId, content }, { req }) => {
      try {
        // Verificar se o usuário está logado
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
        if (!decodedToken) {
          throw new Error("Você não tem permissão para postar um comentário.");
        }

        // Verificar se o postId é válido
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("ID do post inválido.");
        }

        // Verificar se o userId é válido
        const user = await User.findById(decodedToken.userId);

        if (!user) {
          throw new Error("ID do usuário inválido.");
        }

        // Criar um novo comentário
        const newComment = new Comment({
          postId,
          userId: user._id,
          content,
          likes: [], // Inicialmente, nenhum like
          numberOfLikes: 0, // Inicialmente, nenhum like
        });

        // Salvar o novo comentário no banco de dados
        await newComment.save();

        // Retornar a resposta indicando o sucesso da operação e os detalhes do novo comentário criado
        return {
          success: true,
          message: "Comentário criado com sucesso.",
          id: newComment.id,
          postId: newComment.postId,
          userId: newComment.userId,
          content: newComment.content,
        };
      } catch (error) {
        // Se houver algum erro durante a criação do comentário, lançar uma exceção
        throw new Error(`Erro ao criar o comentário: ${error.message}`);
      }
    },

    likeComment: async (_, { commentId }, { req }) => {
      console.log("Like");
      try {
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
        if (!decodedToken) {
          throw new Error("Você não tem permissão para dar like.");
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
          throw new Error("Comentário não encontrado.");
        }

        // Verificar se o usuário já deu like neste comentário
        const alreadyLiked = comment.likes.includes(decodedToken.userId);

        if (alreadyLiked) {
          // Se o usuário já deu like, remover o like e o id do usuário dos likes
          comment.likes = comment.likes.filter(
            (like) => like !== decodedToken.userId
          );
          comment.numberOfLikes -= 1; // Reduzir o número de likes
          await comment.save();

          return {
            success: true,
            message: "Like removido com sucesso.",
            id: comment.id,
            liked: false,
            numberOfLikes: comment.numberOfLikes,
          };
        } else {
          // Se o usuário ainda não deu like, adicionar o like e o id do usuário aos likes
          comment.likes.push(decodedToken.userId);
          comment.numberOfLikes += 1; // Aumentar o número de likes
          await comment.save();

          return {
            success: true,
            message: "Like adicionado com sucesso.",
            id: comment.id,
            liked: true,
            numberOfLikes: comment.numberOfLikes,
          };
        }
      } catch (error) {
        throw new Error(`Erro ao dar like no comentário: ${error.message}`);
      }
    },
    updateComment: async (_, { commentId, updatedContent }, { req }) => {
      try {
        // Verificar se o usuário está autenticado
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
        if (!decodedToken) {
          throw new Error("Você não tem permissão para editar esse post.");
        }

        // Verificar se o comentário existe
        const comment = await Comment.findById(commentId);
        if (!comment) {
          throw new Error("Comentário não encontrado.");
        }

        // Verificar se o usuário é o autor do comentário
        if (comment.userId !== decodedToken.userId) {
          throw new Error(
            "Você não tem permissão para editar este comentário."
          );
        }

        // Atualizar o conteúdo do comentário
        comment.content = updatedContent;
        await comment.save();

        return {
          success: true,
          message: "Comentário atualizado com sucesso.",
          id: comment.id,
          content: comment.content,
        };
      } catch (error) {
        throw new Error(`Erro ao atualizar o comentário: ${error.message}`);
      }
    },

    deleteComment: async (_, { commentId }, { req }) => {
      try {
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
        if (!decodedToken) {
          throw new Error("Você não tem permissão para editar esse post.");
        }

        const comment = await Comment.findOne(commentId);

        if (!comment) {
          throw new Error("Comentário não encontrado.");
        }

        if (comment.userId !== decodedToken.userId) {
          throw new Error(
            "Você não tem autorização para deletar esse comentário."
          );
        }

        await Comment.findOneAndDelete(commentId);

        return {
          success: true,
          message: "Comentário deletado com sucesso!",
        };
      } catch (error) {
        throw new Error(
          `Não foi possível deletar esse comentário: ${error.message} `
        );
      }
    },
  },
};

export default commentResolver;
