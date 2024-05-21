import { HiOutlineExclamationCircle } from "react-icons/hi";
import PropTypes from "prop-types";

export default function AlertModal({ handleDelete, setShowModal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md flex text-center flex-col justify-around">
        <HiOutlineExclamationCircle className="h-10 sm:h-14 w-10 sm:w-14 text-gray-600 mb-2 sm:mb-4 mx-auto" />
        <h3 className="mb-3 sm:mb-5 text-base sm:text-lg text-gray-500">
          Tem certeza de que deseja excluir?
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
  );
}

AlertModal.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
