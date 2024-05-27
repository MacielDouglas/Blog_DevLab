import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import { useMutation, useQuery } from "@apollo/client";
import { ALL_COMMENTS } from "../graphql/queries/comment.query";
import { NEW_COMMENT } from "../graphql/mutation/comment.mutation";

function UserSection({ user }) {
  return (
    <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
      <p>Assinado como:</p>
      <img
        className="h-5 w-5 object-cover rounded-full"
        src={user.profilePicture}
        alt=""
      />
      <Link
        to={"/dashboard?tag=profile"}
        className="text-xs text-cyan-600 hover:underline"
      >
        @{user.username.slice(0, -4)}
      </Link>
    </div>
  );
}

function LoginPrompt() {
  return (
    <div className="text-sm text-teal-500 my-5 flex gap-1">
      Você deve estar logado para comentar.
      <Link className="text-blue-500" to={"/login"}>
        Entrar
      </Link>
    </div>
  );
}

function CommentForm({ comment, setComment, handleSubmit, loading }) {
  return (
    <form
      onSubmit={handleSubmit}
      className="border border-teal-500 rounded-md p-3"
    >
      <textarea
        placeholder="Adicionar um comentário..."
        className="w-full p-3 bg-stone-100 rounded-lg"
        rows="3"
        maxLength="200"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      />
      <div className="flex justify-between items-center mt-5">
        <p className="text-gray-500 text-xs">
          {200 - comment.length} caracteres restantes
        </p>
        <button
          type="submit"
          className="bg-base_03 py-2 px-4 rounded-lg text-stone-100 border border-transparent hover:border-white hover:text-white"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
}

function CommentsList({ comments, handleLike, handleDelete, user, refetch }) {
  return comments.length === 0 ? (
    <p className="text-sm my-5">Não tem comentários!</p>
  ) : (
    <>
      <div className="text-sm my-5 flex items-center gap-1">
        <p>Comentários</p>
        <div className="border border-gray-400 py-1 px-2 rounded-sm">
          <p>{comments.length}</p>
        </div>
      </div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onLike={handleLike}
          onDelete={handleDelete}
          userLog={user}
          refetch={refetch}
        />
      ))}
    </>
  );
}

export default function CommentSection({ postID }) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const { data, loading, refetch } = useQuery(ALL_COMMENTS, {
    variables: {
      postId: postID,
    },
  });

  const [newComment] = useMutation(NEW_COMMENT, {
    onCompleted: async (data) => {
      if (data) {
        await refetch();
      }
    },
    onError: (error) => {
      throw new Error(
        `Não foi possível enviar esse comentário: ${error.message}`
      );
    },
  });

  useEffect(() => {
    if (data && data !== undefined && data.allComments) {
      setComments(data.allComments);
    }
  }, [data]);

  // console.log(data.allComments);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newComment({
        variables: {
          postId: postID,
          content: comment,
        },
      });
      setComment("");
    } catch (error) {
      throw new Error(`Erro ao submeter o comentário: ${error.message}`);
    }
    console.log("submetido");
  };

  const handleLike = (commentId) => {
    console.log(commentId);
    console.log("like");
  };

  const handleDelete = (commentId) => {};

  return (
    <section className="max-w-2xl mx-auto w-full p-3">
      {user ? <UserSection user={user} /> : <LoginPrompt />}
      {user && (
        <CommentForm
          comment={comment}
          setComment={setComment}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}
      <CommentsList
        comments={comments}
        handleLike={handleLike}
        handleDelete={handleDelete}
        user={user}
        refetch={refetch}
      />
    </section>
  );
}
