import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Paid"],
      default: "Pending",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    processedAt: {
      type: Date,
      default: null,
    },

    bankDetails: {
      accountHolderName: {
        type: String,
        required: true,
        trim: true,
      },

      accountNumber: {
        type: String,
        required: true,
        trim: true,
      },

      ifscCode: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      bankName: {
        type: String,
        required: true,
        trim: true,
      },

      branch: {
        type: String,
        trim: true,
      },
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    transactionId: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);

export default Withdrawal;