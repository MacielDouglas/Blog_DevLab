import Post from "../../models/post.models.js";
import slugify from "slugify";
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
  if (!decodedToken || !decodedToken.isAdmin) {
    throw new Error("Você não tem permissão para realizar esta ação.");
  }

  return decodedToken;
};

const postResolver = {
  Query: {
    getPosts: async (_, { slug, input }) => {
      try {
        if (slug) {
          const post = await Post.findOne({ slug }).exec();
          if (!post) {
            throw new Error("Post não encontrado.");
          }
          return [post];
        } else if (input) {
          const { category, title } = input;
          const query = {};
          if (category) {
            query.category = category;
          }
          if (title) {
            query.title = { $regex: title, $options: "i" };
          }
          const filteredPosts = await Post.find(query).exec();
          return filteredPosts;
        } else {
          const posts = await Post.find().exec();
          return posts;
        }
      } catch (error) {
        throw new Error(`Erro ao buscar os posts: ${error.message}`);
      }
    },
  },

  Mutation: {
    createPost: async (_, { newPost }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);

        const existingPost = await Post.findOne({ title: newPost.title });
        if (existingPost) {
          throw new Error("Já existe um post com este título.");
        }

        const slug = slugify(newPost.title, { lower: true });

        const postNew = new Post({
          ...newPost,
          slug: slug,
        });

        await postNew.save();
        return postNew;
      } catch (error) {
        throw new Error(`Erro ao criar o post: ${error.message}`);
      }
    },

    deletePost: async (_, { postId }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);

        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post não encontrado.");
        }

        if (post.userId !== decodedToken.userId) {
          throw new Error(
            "Você não tem autorização para excluir essa postagem."
          );
        }

        await Post.findByIdAndDelete(postId);

        return {
          success: true,
          message: "A postagem foi removida com sucesso.",
        };
      } catch (error) {
        throw new Error(`Erro ao deletar o post: ${error.message}`);
      }
    },

    updatePost: async (_, { id, updatedPost }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);

        const post = await Post.findById(id);
        if (!post) {
          throw new Error("Post não encontrado.");
        }

        if (decodedToken.userId !== post.userId) {
          throw new Error(
            "Você não tem autorização para alterar essa postagem."
          );
        }

        const newSlug = slugify(updatedPost.title, { lower: true });

        Object.assign(post, {
          ...updatedPost,
          slug: newSlug,
        });

        await post.save();

        return {
          success: true,
          message: "Post atualizado com sucesso.",
          title: post.title,
          content: post.content,
          image: post.image,
          category: post.category,
          id: post.id,
          slug: post.slug,
        };
      } catch (error) {
        throw new Error(`Erro ao atualizar postagem: ${error.message}`);
      }
    },
  },
};

export default postResolver;
