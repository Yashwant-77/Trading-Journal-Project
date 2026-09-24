import React, { useEffect, useState } from "react";

import Header from '../components/Header'

import { useForm, useFieldArray } from "react-hook-form";

import { useDispatch } from "react-redux";

import { addPlaybook, updatePlaybook } from "../store/playbooksSlice";

import { useNavigate, useParams } from "react-router-dom";

import API from "../api";



const CreatePlaybook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
const isEditMode = Boolean(id);
const [loadingPlaybook, setLoadingPlaybook] = useState(false);

  // --------------------------------
  // React Hook Form
  // --------------------------------
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      entry_criteria: [
        {
          value: "",
        },
      ],
      exit_criteria: [
        {
          value: "",
        },
      ],
      market_conditions: [
        {
          value: "",
        },
      ],
      notes: "",
    },
  });

  // --------------------------------
  // Entry Criteria
  // --------------------------------
  const {
    fields: entryFields,
    append: appendEntry,
    remove: removeEntry,
  } = useFieldArray({
    control,
    name: "entry_criteria",
  });

  // --------------------------------
  // Exit Criteria
  // --------------------------------
  const {
    fields: exitFields,
    append: appendExit,
    remove: removeExit,
  } = useFieldArray({
    control,
    name: "exit_criteria",
  });

  // --------------------------------
  // Market Conditions
  // --------------------------------
  const {
    fields: marketFields,
    append: appendMarket,
    remove: removeMarket,
  } = useFieldArray({
    control,
    name: "market_conditions",
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchPlaybook = async () => {
      try {
        setLoadingPlaybook(true);

        const response = await API.get(`/playbooks/${id}`);

        const playbook = response.data.playbook;

        reset({
          name: playbook.name || "",
          description: playbook.description || "",

          entry_criteria:
            playbook.entry_criteria?.length > 0
              ? playbook.entry_criteria.map((item) => ({
                  value: item,
                }))
              : [{ value: "" }],

          exit_criteria:
            playbook.exit_criteria?.length > 0
              ? playbook.exit_criteria.map((item) => ({
                  value: item,
                }))
              : [{ value: "" }],

          market_conditions:
            playbook.market_conditions?.length > 0
              ? playbook.market_conditions.map((item) => ({
                  value: item,
                }))
              : [{ value: "" }],

          notes: playbook.notes || "",
        });
      } catch (error) {
        console.error("Error fetching playbook:", error);

        alert(error.response?.data?.msg || "Unable to load playbook.");

        navigate("/playbooks");
      } finally {
        setLoadingPlaybook(false);
      }
    };

    fetchPlaybook();
  }, [id, isEditMode, reset, navigate]);

  // --------------------------------
  // Submit
  // --------------------------------
  const handleAPI = async (formData) => {
    try {
      const data = {
        name: formData.name.trim(),

        description: formData.description.trim(),

        entry_criteria: formData.entry_criteria
          .map((item) => item.value.trim())
          .filter(Boolean),

        exit_criteria: formData.exit_criteria
          .map((item) => item.value.trim())
          .filter(Boolean),

        market_conditions: formData.market_conditions
          .map((item) => item.value.trim())
          .filter(Boolean),

        notes: formData.notes.trim(),
      };

      if (isEditMode) {
        const response = await API.put(`/playbooks/${id}`, data);

        console.log("Playbook updated:", response.data);

        dispatch(updatePlaybook(response.data.playbook));

        navigate("/playbooks");
      } else {
        const response = await API.post("/playbooks/create", data);

        console.log("Playbook created:", response.data);

        dispatch(addPlaybook(response.data.playbook));

        reset();

        navigate("/playbooks");
      }
    } catch (error) {
      console.error(
        isEditMode ? "Update playbook error:" : "Create playbook error:",
        error,
      );

      alert(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          `Something went wrong while ${
            isEditMode ? "updating" : "creating"
          } the playbook.`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />

      <div className="min-h-screen bg-[#0F0F10] text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Edit Playbook" : "Create Playbook"}
            </h1>

            <p className="text-zinc-400 mt-1">
              {isEditMode
                ? "Update the rules and details of your trading strategy."
                : "Define the rules you follow for a trading setup."}
            </p>
          </div>

          {loadingPlaybook ? (
            <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-10 text-center">
              <p className="text-zinc-400">Loading playbook...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleAPI)} className="space-y-5">
              {/* ================================= */}
              {/* BASIC INFORMATION */}
              {/* ================================= */}

              <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">
                  Basic Information
                </h2>

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm text-zinc-400 mb-2">
                    Playbook Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Trendline Breakout"
                    className="w-full bg-[#1E1E1E] border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    {...register("name", {
                      required: "Playbook name is required.",
                      validate: (value) =>
                        value.trim() !== "" || "Playbook name is required.",
                    })}
                  />

                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Description
                  </label>

                  <textarea
                    placeholder="Describe this trading setup..."
                    rows={3}
                    className="w-full bg-[#1E1E1E] border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                    {...register("description")}
                  />
                </div>
              </div>

              {/* ================================= */}
              {/* ENTRY CRITERIA */}
              {/* ================================= */}

              <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Entry Criteria
                </h2>

                <div className="space-y-3">
                  {entryFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Minimum 3 valid trendline touches"
                        className="flex-1 bg-[#1E1E1E] border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        {...register(`entry_criteria.${index}.value`, {
                          required: "Entry criterion is required.",
                        })}
                      />

                      {entryFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEntry(index)}
                          className="px-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => appendEntry({ value: "" })}
                  className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition"
                >
                  + Add Criterion
                </button>
              </div>

              {/* ================================= */}
              {/* EXIT CRITERIA */}
              {/* ================================= */}

              <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Exit Criteria
                </h2>

                <div className="space-y-3">
                  {exitFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Target reaches 2R"
                        className="flex-1 bg-[#1E1E1E] border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        {...register(`exit_criteria.${index}.value`, {
                          required: "Exit criterion is required.",
                        })}
                      />

                      {exitFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExit(index)}
                          className="px-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => appendExit({ value: "" })}
                  className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition"
                >
                  + Add Criterion
                </button>
              </div>

              {/* ================================= */}
              {/* MARKET CONDITIONS */}
              {/* ================================= */}

              <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Market Conditions
                </h2>

                <div className="space-y-3">
                  {marketFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Trending market"
                        className="flex-1 bg-[#1E1E1E] border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        {...register(`market_conditions.${index}.value`, {
                          required: "Market condition is required.",
                        })}
                      />

                      {marketFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMarket(index)}
                          className="px-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => appendMarket({ value: "" })}
                  className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition"
                >
                  + Add Condition
                </button>
              </div>

              {/* ================================= */}
              {/* NOTES */}
              {/* ================================= */}

              <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">Notes</h2>

                <textarea
                  placeholder="Additional notes about this playbook..."
                  rows={4}
                  className="w-full bg-[#1E1E1E] border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
                  {...register("notes")}
                />
              </div>

              {/* ================================= */}
              {/* SUBMIT */}
              {/* ================================= */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-400 hover:bg-emerald-300 text-zinc-950 disabled:bg-emerald-100 font-semibold py-3 rounded-lg transition"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating Playbook..."
                    : "Creating Playbook..."
                  : isEditMode
                    ? "Update Playbook"
                    : "Create Playbook"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePlaybook;
