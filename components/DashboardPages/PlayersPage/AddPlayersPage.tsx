"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addUserStatusSelector } from "@/store/slices/playerSlice";
import SpinnerCustom from "../../Loader/page";
import { IoImageOutline } from "react-icons/io5";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BsArrowRepeat } from "react-icons/bs";
import { IoArrowUndoOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { resetAddUserStatus } from "@/store/slices/playerSlice";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MembershipType,
  UserRole,
  gender,
  statusRequest,
} from "@/common/enums";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addUser } from "@/store/slices/playerSlice";
import { Toaster } from "../../ui/sonner";
import { toast } from "sonner";
import FormInput from "@/components/FormInput";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  Weight,
  Ruler,
  Crown,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  UserPlus,
  WeightIcon,
  Briefcase,
} from "lucide-react";
import { MdHeight, MdPassword } from "react-icons/md";
import { FaYammer } from "react-icons/fa";
import { Player } from "@/store/types/player.types";
import MotionCard from "@/components/Cards/MotionCard";
import { fetchTrainers, selectAllTrainers } from "@/store/slices/trainerSlice";
import { Trainer } from "@/store/types/trainer.types";
type PlayerFormState = Player & {
  password: string;
};
export default function AddPlayersPage() {
  const router = useRouter();
  const trainersData = useAppSelector(selectAllTrainers);

  const initialForm: PlayerFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    role: UserRole.PLAYER,
    profileImage: null,
    playerData: {
      membershipType: MembershipType.BASIC,
      year: null,
      weight: null,
      height: null,
      trainerId: null,
    },
  };
  const dispatch = useAppDispatch();
  const addStatus = useAppSelector(addUserStatusSelector);
  const [forceValidate, setForceValidate] = useState({
    email: false,
    firstName: false,
    lastName: false,
    password: false,
    gender: false,
    phone: false,
    year: false,
    weight: false,
    height: false,
    membershipType: false,
  });
  const isLoading = addStatus === statusRequest.LOADING;
  const [form, setForm] = useState<PlayerFormState>(initialForm);
  const submitModeRef = useRef<"exit" | "continue" | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("playerData.")) {
      const key = name.split(".")[1];

      setForm((prev) => ({
        ...prev,
        playerData: {
          ...prev.playerData,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setForm((prev) => ({
        ...prev,
        profileImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    dispatch(fetchTrainers());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(trainersData)) {
      console.log("Fetched trainers data:", trainersData);
      setTrainers(trainersData);
    }
  }, [trainersData]);
  useEffect(() => {
    if (addStatus === statusRequest.SUCCEEDED) {
      toast.success("Player added successfully!", {
        position: "bottom-center",
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
        },
      });

      setForm(initialForm);
      setPreviewImage(null);

      dispatch(resetAddUserStatus());
      if (submitModeRef.current === "exit") {
        router.push("/playersManagement");
      }

      submitModeRef.current = null;
    } else if (addStatus === statusRequest.FAILED) {
      toast.error("Failed to add player. Please try again.", {
        position: "bottom-center",
      });

      dispatch(resetAddUserStatus());
    }
  }, [addStatus]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      email: !form.email,
      firstName: !form.firstName,
      lastName: !form.lastName,
      password: !form.password,
      gender: !form.gender,
      phone: !form.phone,
      year: !form.playerData?.year,
      weight: !form.playerData?.weight,
      height: !form.playerData?.height,
      membershipType: !form.playerData?.membershipType,
    };

    setForceValidate(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    const formData = new FormData();

    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    formData.append("profileImage", form.profileImage);

    formData.append(
      "playerData",
      JSON.stringify({
        membershipType: form.playerData?.membershipType,
        trainerId: Number(form.playerData?.trainerId),
        year: Number(form.playerData?.year),
        weight: Number(form.playerData?.weight),
        height: Number(form.playerData?.height),
      }),
    );

    dispatch(addUser(formData));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100  mx-auto p-6 lg:p-8 space-y-8">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

        <Toaster />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className=" mx-auto space-y-6"
        >
          {/* Header */}

          {/* Personal Information Card */}
          <MotionCard>
            <div className="bg-linear-to-r from-primary-purple-500 to-secondry-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
            </div>

            <div className="p-6 mx-auto ">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  icon={<Mail />}
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  id="email"
                  showError={forceValidate.email}
                  errorMessage={!form.email ? "Email is required" : ""}
                />

                <FormInput
                  type="text"
                  icon={<User />}
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  showError={forceValidate.firstName}
                  errorMessage={!form.firstName ? "First name is required" : ""}
                />

                <FormInput
                  label="Last Name"
                  icon={<User />}
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  showError={forceValidate.lastName}
                  errorMessage={!form.lastName ? "Last name is required" : ""}
                />

                <FormInput
                  type="text"
                  icon={<Phone />}
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  showError={forceValidate.phone}
                  errorMessage={!form.phone ? "Phone number is required" : ""}
                />

                <Field data-invalid className="space-y-2">
                  <FieldLabel
                    className={`text-sm font-medium ${
                      forceValidate.gender ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    Gender <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Select
                    value={form.gender}
                    onValueChange={(value) => {
                      setForm((prev) => ({ ...prev, gender: value }));
                      setForceValidate((prev) => ({ ...prev, gender: false }));
                    }}
                  >
                    <SelectTrigger
                      validate={forceValidate.gender}
                      className="w-full border-gray-200 focus:border-primary-purple focus:ring-primary-purple"
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(gender).map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    showError={forceValidate.gender}
                    className="text-red-500 text-sm"
                  >
                    Gender is required
                  </FieldError>
                </Field>

                <FormInput
                  type="password"
                  label="Password"
                  icon={<MdPassword />}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  showError={forceValidate.password}
                  errorMessage={!form.password ? "Password is required" : ""}
                />
              </div>
            </div>
          </MotionCard>

          {/* Membership Details Card */}
          <MotionCard>
            <div className="bg-linear-to-r from-primary-purple-500 to-secondry-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HiOutlineClipboardList size={25} />
                Membership Details
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  icon={<FaYammer />}
                  type="number"
                  label="Year"
                  name="playerData.year"
                  value={form.playerData?.year?.toString() ?? ""}
                  onChange={handleChange}
                  showError={
                    forceValidate.year ||
                    (form.playerData?.year !== null &&
                      (Number(form.playerData?.year) < 13 ||
                        Number(form.playerData?.year) > 100))
                  }
                  errorMessage={
                    !form.playerData?.year
                      ? "Age is required"
                      : form.playerData?.year < 13
                        ? "Age must be at least 5 years"
                        : form.playerData.year > 100
                          ? "Age cannot exceed 100 years"
                          : ""
                  }
                />

                <FormInput
                  type="number"
                  icon={<WeightIcon />}
                  name="playerData.weight"
                  label="Weight (kg)"
                  value={form.playerData?.weight?.toString() ?? ""}
                  onChange={handleChange}
                  showError={forceValidate.weight}
                  errorMessage={
                    !form.playerData?.weight ? "Weight is required" : ""
                  }
                />

                <FormInput
                  type="number"
                  icon={<MdHeight />}
                  name="playerData.height"
                  label="Height (cm)"
                  value={form.playerData?.height?.toString() ?? ""}
                  onChange={handleChange}
                  showError={
                    forceValidate.height ||
                    (form.playerData?.height !== null &&
                      (Number(form.playerData?.height) < 100 ||
                        Number(form.playerData?.height) > 230))
                  }
                  errorMessage={
                    !form.playerData?.height
                      ? "Height is required"
                      : Number(form.playerData.height) < 100
                        ? "Height cannot be less than 100 cm"
                        : Number(form.playerData.height) > 230
                          ? "Height cannot exceed 230 cm"
                          : ""
                  }
                />

                <Field data-invalid className="space-y-2">
                  <FieldLabel
                    className={`text-sm font-medium ${
                      forceValidate.membershipType
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    Membership <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Select
                    value={form.playerData.membershipType}
                    onValueChange={(value) => {
                      setForm((prev) => ({
                        ...prev,
                        playerData: {
                          ...prev.playerData,
                          membershipType: value as MembershipType,
                        },
                      }));
                      setForceValidate((prev) => ({
                        ...prev,
                        membershipType: false,
                      }));
                    }}
                  >
                    <SelectTrigger
                      validate={forceValidate.membershipType}
                      className="w-full border-gray-200 focus:border-primary-purple-500 focus:ring-primary-purple-500"
                    >
                      <SelectValue placeholder="Select membership type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MembershipType).map((type) => (
                        <SelectItem key={type} value={type}>
                          <span className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            {type}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    showError={forceValidate.membershipType}
                    className="text-red-500 text-sm"
                  >
                    Membership type is required
                  </FieldError>
                </Field>
                {/* <Field data-invalid className="space-y-2">
                  <FieldLabel className={`text-sm font-medium text-gray-700`}>
                    Assign Trainer <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Select
                    value={form.playerData?.trainerId?.toString() ?? ""}
                    onValueChange={(value) => {
                      setForm((prev) => ({
                        ...prev,
                        playerData: {
                          ...prev.playerData,
                          trainerId: value ? Number(value) : null,
                        },
                      }));
                      setForceValidate((prev) => ({
                        ...prev,
                        trainerId: false,
                      }));
                    }}
                  >
                    <SelectTrigger
                      validate={false}
                      className="w-full border-gray-200 focus:border-primary-purple-500 focus:ring-primary-purple-500"
                    >
                      <SelectValue placeholder="Select a trainer (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((trainer) => (
                        <SelectItem
                          key={trainer.id}
                          value={trainer.trainerData?.id?.toString() ?? ""}
                        >
                          <span className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-purple-500" />
                            {trainer?.firstName} {trainer.lastName}-{" "}
                            {trainer.trainerData?.specialization || "Trainer"}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    showError={false}
                    className="text-red-500 text-sm"
                  >
                    Please select a trainer
                  </FieldError>
                </Field> */}
                <Field data-invalid className="space-y-2">
                  <FieldLabel className={`text-sm font-medium text-gray-700`}>
                    Assign Trainer <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Select
                    value={form.playerData?.trainerId?.toString() ?? ""}
                    onValueChange={(value) => {
                      setForm((prev) => ({
                        ...prev,
                        playerData: {
                          ...prev.playerData,
                          trainerId: value ? Number(value) : null,
                        },
                      }));
                      setForceValidate((prev) => ({
                        ...prev,
                        trainerId: false,
                      }));
                    }}
                  >
                    <SelectTrigger
                      validate={false}
                      className="w-full border-gray-200 focus:border-primary-purple-500 focus:ring-primary-purple-500"
                    >
                      <SelectValue placeholder="Select a Subscription type" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={String(trainer.id)}>
                          <span className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-purple-500" />
                            {trainer?.firstName} {trainer.lastName}-{" "}
                            {trainer.trainerData?.specialization || "Trainer"}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    showError={false}
                    className="text-red-500 text-sm"
                  >
                    Please select a trainer
                  </FieldError>
                </Field>
              </div>
            </div>
          </MotionCard>

          {/* Profile Image Card */}
          <MotionCard>
            <div className="bg-linear-to-r from-primary-purple-500 to-secondry-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <IoImageOutline size={25} />
                Profile Image
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center gap-6">
                {/* Image Preview */}
                {previewImage && (
                  <div className="relative w-32 h-32">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, profileImage: null }));
                        setPreviewImage(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Upload Area */}
                <div className="w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </MotionCard>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
            <Button
              className=" bg-primary-purple-500 p-5 hover:bg-linear-to-r from-primary-purple-500 to-secondry-blue-500 text-white rounded-xl shadow-md transition-all duration-300 "
              type="submit"
              onClick={() => {
                submitModeRef.current = "exit";
              }}
              disabled={isLoading}
              isLoading={isLoading}
              iconIsLoading={<SpinnerCustom className="text-white size-4" />}
              titleAfterLoading="Save & Exit"
              titleIsLoading="Saving..."
              iconAfterLoading={<Save className="w-5 h-5" />}
            ></Button>
            <Button
              className=" bg-primary-purple-500 p-5 hover:bg-linear-to-r from-primary-purple-500 to-secondry-blue-500 text-white rounded-xl shadow-md transition-all duration-300 "
              type="submit"
              onClick={() => {
                submitModeRef.current = "continue";
              }}
              disabled={isLoading}
              isLoading={isLoading}
              iconIsLoading={<SpinnerCustom className="text-white size-4" />}
              titleAfterLoading="Save & Continue"
              titleIsLoading="Saving..."
              iconAfterLoading={<UserPlus className="w-5 h-5" />}
            ></Button>
          </div>
        </motion.div>
      </div>
    </form>
  );
}
