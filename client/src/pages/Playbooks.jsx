
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useSelector } from "react-redux";

const Playbooks = () => {
  const navigate = useNavigate();
  const  playbooks = useSelector(state => state.playbooks.playbooks)

  return (
    <div className="min-h-screen bg-[#121212]">

        <Header/>
    <div className="min-h-screen bg-[#0F0F10] text-white p-6">

      <div className="max-w-6xl mx-auto mt-5">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              My Playbooks
            </h1>

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

        {
          playbooks.length === 0 && 
        
        <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-10 text-center">
          <div className="text-4xl mb-4">
            📋
          </div>

          <h2 className="text-lg font-semibold mb-2">
            No playbooks yet
          </h2>

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
        </div>}

         {playbooks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {playbooks.map((playbook) => (
              <div
                key={playbook._id}
                className="bg-[#18181B] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition"
              >
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
                    <p className="text-lg font-semibold text-indigo-400">
                      {playbook.entry_criteria?.length || 0}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      Entry
                    </p>
                  </div>

                  <div className="bg-[#1E1E1E] rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold text-indigo-400">
                      {playbook.exit_criteria?.length || 0}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      Exit
                    </p>
                  </div>

                  <div className="bg-[#1E1E1E] rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold text-indigo-400">
                      {playbook.market_conditions?.length || 0}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      Market
                    </p>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-5">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/playbooks/${playbook._id}`)
                    }
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm transition"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/playbooks/${playbook._id}/edit`)
                    }
                    className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white py-2 rounded-lg text-sm transition"
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

    </div>
  );
};

export default Playbooks;




