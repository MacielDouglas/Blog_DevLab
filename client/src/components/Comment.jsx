import { useMutation, useQuery } from "@apollo/client";
import { ONE_USER } from "../graphql/queries/user.query";
import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import PropTypes from "prop-types";
import {
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from "../graphql/mutation/comment.mutation";
import AlertModal from "./AlertModal";

export default function Comment({ comment, onLike, userLog, refetch }) {
  const { data, loading } = useQuery(ONE_USER, {
    variables: {
      getUserId: comment.userId,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showModal, setShowModal] = useState(false);

  const [updateComment] = useMutation(UPDATE_COMMENT, {
    onCompleted: async (data) => {
      if (data) {
        refetch();
        setIsEditing(false);
      }
    },
    onError: (error) => {
      throw new Error(
        `Não foi possível alterar esse comentário: ${error.message}`
      );
    },
  });

  const [deleteCommentId] = useMutation(DELETE_COMMENT, {
    onCompleted: async (data) => {
      if (data) await refetch();
    },
    onError: (error) => {
      throw new Error(
        `Não foi possível deletar essa postagem: ${error.message}`
      );
    },
  });

  if (loading) return <p>carregando...</p>;

  const handleEdit = () => {
    if (comment.userId === data.getUser.id) {
      setIsEditing(true);
    }
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    await updateComment({
      variables: {
        commentId: comment.id,
        updatedContent: editedContent,
      },
    });
  };

  const handleDelete = async () => {
    try {
      await deleteCommentId({
        variables: { deleteCommentId: comment.id },
      });
    } catch (error) {
      throw new Error(
        `Não foi possível deletar essa postagem: ${error.message}`
      );
    }
    setShowModal(false);
  };

  const user = data.getUser;
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-6 h-6 rounded-full bg-gray-200"
          src={loading ? "" : user?.profilePicture}
          alt={loading ? "Carregando..." : user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {loading
              ? "Carregando..."
              : user
              ? `@${user.username.slice(0, -4)}`
              : "Usuário anônimo"}
          </span>
          <p className="flex gap-1 items-center">
            <IoCalendarOutline />
            {`${new Date(Number(comment.createdAt)).toLocaleDateString(
              "pt-BR",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )}`}
          </p>
        </div>
        {isEditing ? (
          <div className="border border-base_03 p-2 rounded-md">
            <textarea
              className="w-full rounded-md p-3"
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <p className="text-gray-500 text-xs">
              {200 - editedContent.length} caracteres restantes
            </p>
            <div className="flex justify-end gap-3 p-2">
              <button
                type="button"
                onClick={handleSave}
                className="bg-base_03 py-1 px-3 rounded-md text-stone-200 border border-transparent hover:border-white hover:text-white "
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-red-700 py-1 px-3 rounded-md text-stone-200 border border-transparent hover:border-white hover:text-white "
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                disabled={!userLog}
                onClick={() => onLike(comment.id)}
                className="text-stone-500 hover:text-blue-500 disabled:text-base_03"
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-blue-500">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {user && userLog && user.id === userLog?.id && (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-blue-400 hover:text-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Deletar
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      {showModal && (
        <AlertModal setShowModal={setShowModal} handleDelete={handleDelete} />
      )}
    </div>
  );
}

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    numberOfLikes: PropTypes.number.isRequired,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  userLog: PropTypes.shape({
    id: PropTypes.string,
    profilePicture: PropTypes.string,
    username: PropTypes.string,
  }),
  refetch: PropTypes.func.isRequired,
};
