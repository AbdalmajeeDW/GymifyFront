"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SpinnerCustom from "../../Loader/page";
import { IoImageOutline } from "react-icons/io5";
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
import { gender, statusRequest } from "@/common/enums";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Toaster } from "../../ui/sonner";
import { toast } from "sonner";
import FormInput from "@/components/FormInput";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  ImageIcon,
  UserPlus,
  Award,
  Briefcase,
  FileText,
  Users,
  Star,
  DollarSign,
  Save,
} from "lucide-react";
import { addTrainer, statusAddTrainer } from "@/store/slices/trainerSlice";
import MotionCard from "@/components/Cards/MotionCard";

type TrainerFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  role: string;
  profileImage: File | any;
  trainerData: {
    specialization: string;
    experienceYears: number | null;
    certifications: string;
    bio: string;
    hourlyRate: number | null;
    currentClients: number | null;
  };
};

export default function AddTrainerPage() {
  const router = useRouter();
  const initialForm: TrainerFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    role: "trainer",
    profileImage: null,
    trainerData: {
      specialization: "",
      experienceYears: null,
      certifications: "",
      bio: "",
      hourlyRate: null,
      currentClients: null,
    },
  };
  const dispatch = useAppDispatch();
  const addStatus = useAppSelector(statusAddTrainer);
  const [forceValidate, setForceValidate] = useState({
    email: false,
    firstName: false,
    lastName: false,
    password: false,
    gender: false,
    phone: false,
    specialization: false,
    experienceYears: false,
    certifications: false,
    bio: false,
    hourlyRate: false,
    currentClients: false,
  });
  const isLoading = addStatus === statusRequest.LOADING;
  const [form, setForm] = useState<TrainerFormState>(initialForm);
  const submitModeRef = useRef<"exit" | "continue" | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("trainerData.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        trainerData: {
          ...prev.trainerData,
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
    if (addStatus === statusRequest.SUCCEEDED) {
      toast.success("Trainer added successfully!", {
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
        router.push("/trainersManagement");
      }

      submitModeRef.current = null;
    } else if (addStatus === statusRequest.FAILED) {
      toast.error("Failed to add trainer. Please try again.", {
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
      specialization: !form.trainerData.specialization,
      experienceYears: !form.trainerData.experienceYears,
      certifications: !form.trainerData.certifications,
      bio: !form.trainerData.bio,
      hourlyRate: !form.trainerData.hourlyRate,
      currentClients: !form.trainerData.currentClients,
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
    formData.append("role", "trainer");

    formData.append(
      "trainerData",
      JSON.stringify({
        specialization: form.trainerData.specialization,
        experienceYears: Number(form.trainerData.experienceYears),
        certifications: form.trainerData.certifications,
        bio: form.trainerData.bio,
        hourlyRate: Number(form.trainerData.hourlyRate),
        currentClients: Number(form.trainerData.currentClients),
      }),
    );

    dispatch(addTrainer(formData));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100  mx-auto  space-y-8">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

        <Toaster />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto space-y-6"
        >
          <MotionCard className="bg-white rounded-2xl mx-auto  shadow-xl overflow-hidden border border-gray-100 transition-all duration-300">
            <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
            </div>

            <div className="p-6 mx-auto ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  icon={<Mail className="w-4 h-4" />}
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
                  icon={<User className="w-4 h-4" />}
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
                  icon={<User className="w-4 h-4" />}
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
                  icon={<Phone className="w-4 h-4" />}
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
                      className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(gender).map((g) => (
                        <SelectItem key={g} value={g}>
                          {g === "male" ? "Male" : "Female"}
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
                  icon={<Lock className="w-4 h-4" />}
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

          {/* Professional Information Card */}
          <MotionCard className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300">
            <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5" />
                Professional Information
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  icon={<Briefcase className="w-4 h-4" />}
                  type="text"
                  label="Specialization"
                  name="trainerData.specialization"
                  value={form.trainerData.specialization}
                  onChange={handleChange}
                  showError={forceValidate.specialization}
                  errorMessage={
                    !form.trainerData.specialization
                      ? "Specialization is required"
                      : ""
                  }
                />

                <FormInput
                  icon={<Star className="w-4 h-4" />}
                  type="number"
                  label="Experience Years"
                  name="trainerData.experienceYears"
                  value={form.trainerData.experienceYears?.toString() ?? ""}
                  onChange={handleChange}
                  showError={forceValidate.experienceYears}
                  errorMessage={
                    !form.trainerData.experienceYears
                      ? "Experience years is required"
                      : ""
                  }
                />

                <FormInput
                  icon={<Award className="w-4 h-4" />}
                  type="text"
                  label="Certifications"
                  name="trainerData.certifications"
                  value={form.trainerData.certifications}
                  onChange={handleChange}
                  showError={forceValidate.certifications}
                  errorMessage={
                    !form.trainerData.certifications
                      ? "Certifications are required"
                      : ""
                  }
                />

                <FormInput
                  icon={<DollarSign className="w-4 h-4" />}
                  type="number"
                  label="Hourly Rate (SAR)"
                  name="trainerData.hourlyRate"
                  value={form.trainerData.hourlyRate?.toString() ?? ""}
                  onChange={handleChange}
                  showError={forceValidate.hourlyRate}
                  errorMessage={
                    !form.trainerData.hourlyRate
                      ? "Hourly rate is required"
                      : ""
                  }
                />

                <FormInput
                  icon={<Users className="w-4 h-4" />}
                  type="number"
                  label="Current Clients"
                  name="trainerData.currentClients"
                  value={form.trainerData.currentClients?.toString() ?? ""}
                  onChange={handleChange}
                  showError={forceValidate.currentClients}
                  errorMessage={
                    !form.trainerData.currentClients
                      ? "Current clients is required"
                      : ""
                  }
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline ml-1" />
                    Bio <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="trainerData.bio"
                    value={form.trainerData.bio}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      forceValidate.bio && !form.trainerData.bio
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-purple-500"
                    }`}
                    placeholder="Write a brief bio about the trainer..."
                  />
                  {forceValidate.bio && !form.trainerData.bio && (
                    <p className="mt-1 text-sm text-red-600">Bio is required</p>
                  )}
                </div>
              </div>
            </div>
          </MotionCard>

          {/* Profile Image Card */}
          <MotionCard className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300">
            <div className="bg-linear-to-r from-purple-500 to-blue-500 px-6 py-4">
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
              type="submit"
              onClick={() => {
                submitModeRef.current = "exit";
              }}
              className=" bg-primary-purple-500 p-5 hover:bg-linear-to-r from-primary-purple-500 to-secondry-blue-500 text-white rounded-xl shadow-md transition-all duration-300 "
              disabled={isLoading}
              isLoading={isLoading}
              iconIsLoading={<SpinnerCustom className="text-white size-4" />}
              titleAfterLoading="Save & Exit"
              titleIsLoading="Saving..."
              iconAfterLoading={<Save className="w-5 h-5" />}
            ></Button>
            <Button
              type="submit"
              onClick={() => {
                submitModeRef.current = "continue";
              }}
              disabled={isLoading}
              className=" bg-primary-purple-500 p-5 hover:bg-linear-to-r from-primary-purple-500 to-secondry-blue-500 text-white rounded-xl shadow-md transition-all duration-300 "
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
