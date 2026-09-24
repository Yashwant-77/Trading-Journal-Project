import React , {useState} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { removePlaybook } from "../store/playbooksSlice";
import API from "../api";
import { Trash2 } from "lucide-react";

const Playbooks = () => {
  const navigate = useNavigate();
  const playbooks = useSelector((state) => state.playbooks.playbooks);
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState({
  open: false,
  id: null,
  name: "",
});

const [toast, setToast] = useState({
  show: false,
  type: "",
  message: "",
});


const showToast = (type, message) => {
  setToast({
    show: true,
    type,
    message,
  });

  setTimeout(() => {
    setToast({
      show: false,
      type: "",
      message: "",
    });
  }, 3000);
};

const openDeleteModal = (id, name) => {
  setDeleteModal({
    open: true,
    id,
    name,
  });
};

const confirmDelete = async () => {
  const { id } = deleteModal;

  try {
    await API.delete(`/playbooks/${id}`);

    dispatch(removePlaybook(id));

    setDeleteModal({
      open: false,
      id: null,
      name: "",
    });

    showToast("success", "Playbook deleted successfully.");
  } catch (error) {
    console.error("Delete playbook error:", error);

    setDeleteModal({
      open: false,
      id: null,
      name: "",
    });

    showToast(
      "error",
      error.response?.data?.message ||
        "Unable to delete playbook. Please try again."
    );
  }
};
  const handleDelete = async (id, name) => {
  try {
    await API.delete(`/playbooks/${id}`);

    dispatch(removePlaybook(id));

    showToast("success", "Playbook deleted successfully.");
  } catch (error) {
    console.error("Delete playbook error:", error);

    showToast(
      "error",
      error.response?.data?.message ||
        "Unable to delete playbook. Please try again."
    );
  }
};

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      <div className="min-h-screen bg-[#0F0F10] text-white p-6">
        <div className="max-w-6xl mx-auto mt-5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">My Playbooks</h1>

              <p className="text-zinc-400 mt-1">
                Create and manage your trading strategies.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/playbooks/new")}
              className="rounded-lg  bg-emerald-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300"
            >
              + Add New Playbook
            </button>
          </div>

          {playbooks.length === 0 && (
            <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-10 text-center">
              <div className="text-4xl mb-4">📋</div>

              <h2 className="text-lg font-semibold mb-2">No playbooks yet</h2>

              <p className="text-zinc-400 mb-6">
                Create your first playbook to define your trading rules.
              </p>

              <button
                type="button"
                onClick={() => navigate("/playbooks/new")}
                className="bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold px-5 py-2.5 rounded-lg transition "
              >
                Create Your First Playbook
              </button>
            </div>
          )}

          {playbooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {playbooks.map((playbook) => (
                <div
                  key={playbook._id}
                  className="relative bg-[#18181B] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition"
                >
                 <button
  type="button"
  onClick={() => openDeleteModal(playbook._id, playbook.name)}
  className="absolute top-4 right-4 p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
  title="Delete Playbook"
>
  <Trash2 size={18} />
</button>
                  {/* Name */}
                  <h2 className="text-lg font-semibold text-white">
                    {playbook.name}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                    {playbook.description || "No description provided."}
                  </p>

                  {/* Rule counts */}
                  <div className="grid grid-cols-3 gap-2 mt-5">
                    <div className="bg-[#1E1E1E] rounded-lg p-3 text-center">
                      <p className="text-lg font-semibold text-emerald-400">
                        {playbook.entry_criteria?.length || 0}
                      </p>

                      <p className="text-xs text-zinc-500 mt-1">Entry</p>
                    </div>

                    <div className="bg-[#1E1E1E] rounded-lg p-3 text-center">
                      <p className="text-lg font-semibold text-emerald-400">
                        {playbook.exit_criteria?.length || 0}
                      </p>

                      <p className="text-xs text-zinc-500 mt-1">Exit</p>
                    </div>

                    <div className="bg-[#1E1E1E] rounded-lg p-3 text-center">
                      <p className="text-lg font-semibold text-emerald-400">
                        {playbook.market_conditions?.length || 0}
                      </p>

                      <p className="text-xs text-zinc-500 mt-1">Market</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-5">
                    <button
                      type="button"
                      onClick={() => navigate(`/playbooks/${playbook._id}`)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm transition"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/playbooks/${playbook._id}/edit`)
                      }
                      className="flex-1 bg-emerald-400 font-bold text-zinc-950  hover:bg-emerald-300 py-2 rounded-lg text-sm transition"
                    >
                      Edit
                    </button>

                 
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteModal.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="w-full max-w-md bg-[#18181B] border border-zinc-800 rounded-xl p-6 shadow-2xl">

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
          <Trash2 size={20} className="text-red-400" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Delete Playbook?
          </h2>

          <p className="text-sm text-zinc-400 mt-2">
            Are you sure you want to delete{" "}
            <span className="text-white font-medium">
              "{deleteModal.name}"
            </span>
            ?
          </p>

          <p className="text-xs text-zinc-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() =>
            setDeleteModal({
              open: false,
              id: null,
              name: "",
            })
          }
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm transition"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={confirmDelete}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition"
        >
          Delete
        </button>
      </div>

    </div>
  </div>
)}

{toast.show && (
  <div className="fixed top-6 right-6 z-[60]">
    <div
      className={`flex items-center gap-3 min-w-[300px] max-w-sm px-4 py-3 rounded-lg border shadow-xl ${
        toast.type === "success"
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      <div className="flex-1">
        <p className="text-sm font-medium">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setToast({
            show: false,
            type: "",
            message: "",
          })
        }
        className="text-zinc-500 hover:text-white transition"
      >
        ×
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Playbooks;
