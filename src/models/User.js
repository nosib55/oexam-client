import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },

    institution: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
    },

    userClass: {
      type: String,
    },

    image: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    location: {
      type: String,
    },

    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.User) {
  mongoose.deleteModel("User");
}

const User = mongoose.model("User", UserSchema);
export default User;