import Comment from "../../models/comment.models.js";
import Post from "../../models/post.models.js";
import User from "./../../models/user.model.js";
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
        const decodedToken = verifyAuthorization(req);

        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("ID do post inválido.");
        }

        const user = await User.findById(decodedToken.userId);
        if (!user) {
          throw new Error("ID do usuário inválido.");
        }

        const newComment = new Comment({
          postId,
          userId: decodedToken.userId,
          content,
          likes: [],
          numberOfLikes: 0,
        });

        await newComment.save();

        return {
          success: true,
          message: "Comentário criado com sucesso.",
          id: newComment.id,
          postId: newComment.postId,
          userId: newComment.userId,
          content: newComment.content,
        };
      } catch (error) {
        throw new Error(`Erro ao criar o comentário: ${error.message}`);
      }
    },

    likeComment: async (_, { commentId }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken) {
          throw new Error("Você não tem permissão para dar like.");
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
          throw new Error("Comentário não encontrado.");
        }

        const alreadyLiked = comment.likes.includes(decodedToken.userId);

        if (alreadyLiked) {
          comment.likes = comment.likes.filter(
            (like) => like !== decodedToken.userId
          );
          comment.numberOfLikes -= 1;
          await comment.save();

          return {
            success: true,
            message: "Like removido com sucesso.",
            id: comment.id,
            liked: false,
            numberOfLikes: comment.numberOfLikes,
          };
        } else {
          comment.likes.push(decodedToken.userId);
          comment.numberOfLikes += 1;
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
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken) {
          throw new Error("Você não tem permissão para editar esse post.");
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
          throw new Error("Comentário não encontrado.");
        }

        if (comment.userId !== decodedToken.userId) {
          throw new Error(
            "Você não tem permissão para editar este comentário."
          );
        }

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
      const comments = await Comment.findById(commentId);
      if (!comments) {
        throw new Error("Comentário não encontrado.");
      }

      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken || !decodedToken.isAdmin) {
          throw new Error("Você não tem permissão para realizar esta ação.");
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
          throw new Error("Comentário não encontrado.");
        }

        if (comment.userId !== decodedToken.userId) {
          throw new Error(
            "Você não tem autorização para deletar esse comentário."
          );
        }

        await Comment.findByIdAndDelete(commentId);

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
