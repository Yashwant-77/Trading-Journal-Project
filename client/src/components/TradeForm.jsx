import React, { useState } from "react";
import API from "../api";
import { useForm } from "react-hook-form";

export default function TradeForm({ onTradeAdded }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      symbol: "",
      type: "LONG",
      playbook: "",
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

  const handleAPI = async (formData) => {
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      // For now, image is only selected locally.
      // Later you can upload it with FormData.
      console.log("Trade data:", payload);
      console.log("Screenshot:", selectedImage);

      await API.post("/trades", payload);

      reset();
      setSelectedImage(null);

      // onTradeAdded();
    } catch (error) {
      console.error("Error creating trade:", error);

      setError("root.serverError", {
        type: "server",
        message:
          error.response?.data?.msg ||
          "Something went wrong while creating the trade.",
      });
    }
  };

  // Handle selecting image through file input
  const handleImageSelect = (file) => {
    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Optional size restriction: 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5 MB.");
      return;
    }

    setSelectedImage(file);
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

    const file = e.dataTransfer.files[0];

    handleImageSelect(file);
  };

  return (
    <div className="bg-[#1E1E1E] text-white p-6 pb-10 rounded-lg shadow-md mb-6  ">
      <h2 className="text-xl font-bold bg-zinc-900 mb-4 rounded-lg border border-zinc-700 px-4 py-2 t  transition  text-emerald-400 sm:inline-flex text-center">
        Log New Trade
      </h2>

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
              <label className="block text-sm font-medium mb-2">
                Playbook(Strategy)
              </label>

              <select
                className="w-full px-3 py-2 border bg-[#1E1E1E] border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-300 "
                {...register("playbook", {
                  required: "Type is required",
                })}
              >
                <option value="3 Touch Point Break">3 Touch Point Break</option>
                <option value="2 Touch point Break">2 Touch point Break</option>
              </select>

              {errors.playbook && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.playbook.message}
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

          
          </div>
            {/* Server error */}
            {errors.root?.serverError && (
              <p className="text-red-400 text-sm">
                {errors.root.serverError.message}
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
            {!selectedImage ? (
              <>
                <div className="text-5xl mb-4">📸</div>

                <h3 className="text-lg font-semibold mb-2">Trade Screenshot</h3>

                <p className="text-sm text-zinc-400 text-center mb-4">
                  Drag and drop your trade screenshot here
                </p>

                <p className="text-xs text-zinc-500 mb-4">or</p>

                <label className="cursor-pointer bg-emerald-400 hover:bg-emerald-300 text-black font-semibold px-4 py-2 rounded">
                  Choose Screenshot
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e.target.files[0])}
                  />
                </label>

                <p className="text-xs text-zinc-500 mt-4">
                  PNG, JPG, JPEG • Max 5 MB
                </p>
              </>
            ) : (
              <>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Trade screenshot preview"
                  className="max-h-[300px] max-w-full rounded-lg object-contain"
                />

                <p className="text-sm text-zinc-300 mt-3">
                  {selectedImage.name}
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="mt-4 px-4 py-2 rounded bg-red-500 hover:bg-red-400 text-white font-semibold"
                >
                  Remove Screenshot
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
