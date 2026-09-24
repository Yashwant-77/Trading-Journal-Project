import React, { useState, useEffect } from "react";
import API from "../api";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addTrade } from "../store/tradesSlice";

export default function TradeForm() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const playbooks = useSelector((state) => state.playbooks.playbooks);
  const [checklist, setChecklist] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      symbol: "",
      type: "LONG",
      playbook_id: "",
      entry_price: "",
      exit_price: "",
      quantity: "",
      entry_date: new Date().toISOString().split("T")[0],
      entry_time: "",
      pnl: "",
      entry_fees: "",
      exit_fees: "",
      sl: "",
      tp: "",
      reason: "",
      tags: "",
      notes: "",
    },
  });

  const selectedPlaybookId = watch("playbook_id");

  const handleAPI = async (formData) => {
    try {
      const payload = {
        ...formData,

        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),

        checklist,
      };

      // 1. Create the trade
      const response = await API.post("/trades", payload);

      const createdTrade = response.data;

      let finalTrade = createdTrade;

      // 2. Upload screenshots after trade is created
      if (selectedImages.length > 0) {
        const imageFormData = new FormData();

        selectedImages.forEach((image) => {
          imageFormData.append("screenshots", image.file);
        });

        const screenshotResponse = await API.post(
          `/trades/${createdTrade._id}/screenshots`,
          imageFormData,
        );

        finalTrade = {
          ...createdTrade,
          screenshots: screenshotResponse.data.screenshots,
        };
      }

      // 3. Add complete trade to Redux
      dispatch(addTrade(finalTrade));

      setSuccess(true);

      // 4. Reset form
      reset();
      setChecklist([]);

      // 5. Clean up preview URLs
      selectedImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });

      setSelectedImages([]);
    } catch (error) {
      console.error("Error creating trade:", error);

      setSuccess(false);

      setError("root.serverError", {
        type: "server",
        message:
          error.response?.data?.msg ||
          "Something went wrong while creating the trade.",
      });
    }
  };

  useEffect(() => {
    const selectedPlaybook = playbooks.find(
      (playbook) => playbook._id === selectedPlaybookId,
    );

    if (!selectedPlaybook) {
      setChecklist([]);
      return;
    }

    const rules = [
      ...(selectedPlaybook.entry_criteria || []).map((criterion) => ({
        category: "entry",
        criterion,
        followed: false,
      })),

      ...(selectedPlaybook.exit_criteria || []).map((criterion) => ({
        category: "exit",
        criterion,
        followed: false,
      })),

      ...(selectedPlaybook.market_conditions || []).map((criterion) => ({
        category: "market",
        criterion,
        followed: false,
      })),
    ];

    setChecklist(rules);
  }, [selectedPlaybookId, playbooks]);

  const toggleChecklistItem = (index) => {
    setChecklist((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              followed: !item.followed,
            }
          : item,
      ),
    );
  };

  // Handle selecting image through file input
  // Handle selecting multiple screenshots
  const handleImageSelect = (files) => {
    if (!files || files.length === 0) return;

    const newImages = [];

    Array.from(files).forEach((file) => {
      // Only allow images
      if (!file.type.startsWith("image/")) {
        return;
      }

      // Max 5 MB per image
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      newImages.push({
        file,
        preview: URL.createObjectURL(file),
      });
    });

    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  // Remove a selected screenshot
  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => {
      const imageToRemove = prev[index];

      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // Drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    handleImageSelect(e.dataTransfer.files);
  };

  return (
    <div className="bg-[#1E1E1E] text-white p-6 pb-10 rounded-lg shadow-md mb-6  ">
      <div className="mb-6">
        <h1 className="text-xl sm:text-lg font-bold text-white">
          Log Your New Trades
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          Journal your trades properly
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDE - FORM */}
        <form onSubmit={handleSubmit(handleAPI)} className="flex-1">
          <div className="max-h-85 overflow-y-auto custom-scrollbar pl-1  pr-3 space-y-4 mb-5">
            {/* Symbol */}
            <div>
              <label className="block text-sm font-medium mb-2">Symbol</label>

              <input
                type="text"
                placeholder="e.g., AAPL"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.symbol ? "border-red-500" : "border-gray-500"
                }`}
                {...register("symbol", {
                  required: "Symbol is required",
                })}
              />

              {errors.symbol && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.symbol.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>

              <select
                className="w-full px-3 py-2 border bg-[#1E1E1E] border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 "
                {...register("type", {
                  required: "Type is required",
                })}
              >
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>

              {errors.type && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Playbook */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Playbook
              </label>

              <select
                {...register("playbook_id", {
                  required: "Please select a playbook.",
                })}
                className="w-full bg-[#1E1E1E] border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              >
                <option value="">Select Playbook</option>

                {playbooks.map((playbook) => (
                  <option key={playbook._id} value={playbook._id}>
                    {playbook.name}
                  </option>
                ))}
              </select>

              {errors.playbook_id && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.playbook_id.message}
                </p>
              )}
            </div>

            {/* Entry Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Entry Price
              </label>

              <input
                type="text"
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.entry_price ? "border-red-500" : "border-gray-500"
                }`}
                {...register("entry_price", {
                  required: "Entry price is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Quantity cannot be negative",
                  },
                })}
              />

              {errors.entry_price && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.entry_price.message}
                </p>
              )}
            </div>

            {/* Exit Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Exit Price
              </label>

              <input
                type="text"
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.exit_price ? "border-red-500" : "border-gray-500"
                }`}
                {...register("exit_price", {
                  required: "Entry price is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Quantity cannot be negative",
                  },
                })}
              />

              {errors.exit_price && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.exit_price.message}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>

              <input
                type="text"
                placeholder="0"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.quantity ? "border-red-500" : "border-gray-500"
                }`}
                {...register("quantity", {
                  required: "Quantity is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Quantity cannot be negative",
                  },
                })}
              />

              {errors.quantity && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            {/* Entry Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Entry Date
              </label>

              <input
                type="date"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.entry_date ? "border-red-500" : "border-gray-500"
                }`}
                {...register("entry_date", {
                  required: "Entry date is required",
                  valueAsDate: true,
                })}
              />

              {errors.entry_date && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.entry_date.message}
                </p>
              )}
            </div>

            {/* Entry Time */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Entry Time
              </label>

              <input
                type="time"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.entry_time ? "border-red-500" : "border-gray-500"
                }`}
                {...register("entry_time", {
                  required: "Entry time is required",
                })}
              />

              {errors.entry_time && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.entry_time.message}
                </p>
              )}
            </div>

            {/* Exit Time */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Exit Time{" "}
              </label>

              <input
                type="time"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.exit_time ? "border-red-500" : "border-gray-500"
                }`}
                {...register("exit_time", {
                  required: "Entry time is required",
                })}
              />

              {errors.exit_time && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.exit_time.message}
                </p>
              )}
            </div>

            {/* Stop Loss */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Stop Loss
              </label>

              <input
                type="text"
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.sl ? "border-red-500" : "border-gray-500"
                }`}
                {...register("sl", {
                  required: "Stop loss is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Stop loss must be greater than 0",
                  },
                })}
              />

              {errors.sl && (
                <p className="text-red-400 text-sm mt-1">{errors.sl.message}</p>
              )}
            </div>

            {/* Take Profit */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Take Profit
              </label>

              <input
                type="text"
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.tp ? "border-red-500" : "border-gray-500"
                }`}
                {...register("tp", {
                  required: "Take profit is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Take profit must be greater than 0",
                  },
                })}
              />

              {errors.tp && (
                <p className="text-red-400 text-sm mt-1">{errors.tp.message}</p>
              )}
            </div>

            {/* Entry Fees */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Entry Fees
              </label>

              <input
                type="text"
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.entry_fees ? "border-red-500" : "border-gray-500"
                }`}
                {...register("entry_fees", {
                  required: "Entry fees are required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Fees cannot be negative",
                  },
                })}
              />

              {errors.entry_fees && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.entry_fees.message}
                </p>
              )}
            </div>

            {/* Exit Fees */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Exit Fees
              </label>

              <input
                type="text"
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.exit_fees ? "border-red-500" : "border-gray-500"
                }`}
                {...register("exit_fees", {
                  required: "Exit fees are required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Fees cannot be negative",
                  },
                })}
              />

              {errors.exit_fees && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.exit_fees.message}
                </p>
              )}
            </div>

            {/* P&L */}
            <div>
              <label className="block text-sm font-medium mb-2">P&L</label>

              <input
                type="text"
                placeholder="e.g., 250.50 or -100"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.pnl ? "border-red-500" : "border-gray-500"
                }`}
                {...register("pnl", {
                  required: "P&L is required",
                  valueAsNumber: true,
                })}
              />

              {errors.pnl && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.pnl.message}
                </p>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-2">Reason</label>

              <input
                type="text"
                placeholder="Why did you take this trade?"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.reason ? "border-red-500" : "border-gray-500"
                }`}
                {...register("reason", {
                  required: "Reason is required",
                })}
              />

              {errors.reason && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.reason.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>

              <input
                type="text"
                placeholder="e.g., breakout, momentum"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  errors.tags ? "border-red-500" : "border-gray-500"
                }`}
                {...register("tags", {
                  required: "Tags are required",
                })}
              />

              {errors.tags && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.tags.message}
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>

              <textarea
                rows="4"
                placeholder="Additional notes about this trade"
                className="w-full px-3 py-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300"
                {...register("notes")}
              />
            </div>

            {/* ================================= */}
            {/* TRADE QUALITY CHECKLIST */}
            {/* ================================= */}

            {checklist.length > 0 && (
              <div className="bg-[#18181B] border border-zinc-800 rounded-xl p-5 mb-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Trade Quality Checklist
                    </h2>

                    <p className="text-sm text-zinc-400 mt-1">
                      Check the rules you actually followed for this trade.
                    </p>
                  </div>

                  <div className="text-sm text-zinc-400">
                    {checklist.filter((item) => item.followed).length} /{" "}
                    {checklist.length}
                  </div>
                </div>

                {/* Entry Rules */}
                {checklist.some((item) => item.category === "entry") && (
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-emerald-400 mb-3">
                      Entry Rules
                    </h3>

                    <div className="space-y-2">
                      {checklist.map((item, index) => {
                        if (item.category !== "entry") return null;

                        return (
                          <label
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-[#1E1E1E] hover:bg-zinc-800 cursor-pointer transition"
                          >
                            <input
                              type="checkbox"
                              checked={item.followed}
                              onChange={() => toggleChecklistItem(index)}
                              className="mt-1 w-4 h-4 accent-emerald-400"
                            />

                            <span
                              className={`text-sm ${
                                item.followed ? "text-white" : "text-zinc-400"
                              }`}
                            >
                              {item.criterion}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Exit Rules */}
                {checklist.some((item) => item.category === "exit") && (
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-emerald-400 mb-3">
                      Exit Rules
                    </h3>

                    <div className="space-y-2">
                      {checklist.map((item, index) => {
                        if (item.category !== "exit") return null;

                        return (
                          <label
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-[#1E1E1E] hover:bg-zinc-800 cursor-pointer transition"
                          >
                            <input
                              type="checkbox"
                              checked={item.followed}
                              onChange={() => toggleChecklistItem(index)}
                              className="mt-1 w-4 h-4 accent-emerald-400"
                            />

                            <span
                              className={`text-sm ${
                                item.followed ? "text-white" : "text-zinc-400"
                              }`}
                            >
                              {item.criterion}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Market Conditions */}
                {checklist.some((item) => item.category === "market") && (
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-400 mb-3">
                      Market Conditions
                    </h3>

                    <div className="space-y-2">
                      {checklist.map((item, index) => {
                        if (item.category !== "market") return null;

                        return (
                          <label
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-[#1E1E1E] hover:bg-zinc-800 cursor-pointer transition"
                          >
                            <input
                              type="checkbox"
                              checked={item.followed}
                              onChange={() => toggleChecklistItem(index)}
                              className="mt-1 w-4 h-4 accent-emerald-400"
                            />

                            <span
                              className={`text-sm ${
                                item.followed ? "text-white" : "text-zinc-400"
                              }`}
                            >
                              {item.criterion}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Current Score */}
                <div className="mt-5 pt-4 border-t border-zinc-800 flex justify-between">
                  <span className="text-sm text-zinc-400">Rules followed</span>

                  <span className="text-sm font-semibold text-white">
                    {checklist.filter((item) => item.followed).length} /{" "}
                    {checklist.length}
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Server error */}
          {errors.root?.serverError && (
            <p className="text-red-400 text-sm my-4">
              {errors.root.serverError.message}
            </p>
          )}

          {/* Server success  msg */}
          {success && (
            <p className="text-green-400 text-sm my-4">
              Successfully added the trade !
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-400 hover:bg-emerald-300 disabled:bg-gray-500 text-black font-bold py-2 px-4 rounded"
          >
            {isSubmitting ? "Creating..." : "Log Trade"}
          </button>
        </form>

        {/* RIGHT SIDE - SCREENSHOT */}
        {/* RIGHT SIDE - SCREENSHOTS */}
        <div className="flex-1 min-h-[400px]">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`h-full min-h-[400px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition ${
              isDragging
                ? "border-emerald-400 bg-emerald-400/10"
                : "border-zinc-600 bg-zinc-900/40"
            }`}
          >
            {selectedImages.length === 0 ? (
              <>
                <div className="text-5xl mb-4">📸</div>

                <h3 className="text-lg font-semibold mb-2">
                  Trade Screenshots
                </h3>

                <p className="text-sm text-zinc-400 text-center mb-4">
                  Drag and drop your trade screenshots here
                </p>

                <p className="text-xs text-zinc-500 mb-4">or</p>

                <label className="cursor-pointer bg-emerald-400 hover:bg-emerald-300 text-black font-semibold px-4 py-2 rounded">
                  Choose Screenshots
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageSelect(e.target.files)}
                  />
                </label>

                <p className="text-xs text-zinc-500 mt-4">
                  PNG, JPG, JPEG, WEBP • Max 5 MB each
                </p>
              </>
            ) : (
              <>
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">
                      Selected Screenshots
                    </h3>

                    <span className="text-xs text-zinc-400">
                      {selectedImages.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedImages.map((image, index) => (
                      <div
                        key={image.preview}
                        className="relative group rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900"
                      >
                        <img
                          src={image.preview}
                          alt={`Trade screenshot ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-500 text-white flex items-center justify-center transition"
                          title="Remove screenshot"
                        >
                          ×
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                          <p className="text-xs text-zinc-300 truncate">
                            {image.file.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <label className="mt-4 w-full cursor-pointer border border-zinc-700 hover:border-emerald-400 rounded-lg py-2.5 flex items-center justify-center text-sm text-zinc-300 hover:text-emerald-400 transition">
                    + Add More Screenshots
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageSelect(e.target.files)}
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
