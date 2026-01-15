"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Droplet,
  Edit2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const DonorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [eligibility, setEligibility] = useState({
    canDonate: true,
    daysRemaining: 0,
  });

  // Initial Donor Data (In a real app, this comes from your Database/API)
  const [donorData, setDonorData] = useState({
    name: "Rahat Chowdhury",
    bloodGroup: "O+",
    age: 28,
    gender: "Male",
    lastDonationDate: "2023-11-15",
    phone: "+880 1712 345678",
    email: "rahat@example.com",
    city: "Dhaka",
    area: "Dhanmondi",
  });

  // Logic: Auto-check Eligibility
  useEffect(() => {
    if (!donorData.lastDonationDate) return;

    const today = new Date();
    const lastDate = new Date(donorData.lastDonationDate);
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Standard rule: 120 days (4 months) between donations
    const waitingPeriod = 120;

    if (diffDays < waitingPeriod) {
      setEligibility({
        canDonate: false,
        daysRemaining: waitingPeriod - diffDays,
      });
    } else {
      setEligibility({ canDonate: true, daysRemaining: 0 });
    }
  }, [donorData.lastDonationDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonorData({ ...donorData, [name]: value });
  };

  return (
    <div className="mx-auto mt-10 max-w-4xl p-4 md:p-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-red-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-red-600">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{donorData.name}</h1>
              <p className="opacity-90">Donor ID: #DB-9921</p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="secondary"
            className="bg-white text-red-600 hover:bg-slate-100"
          >
            {isEditing ? (
              <Save className="mr-2 h-4 w-4" />
            ) : (
              <Edit2 className="mr-2 h-4 w-4" />
            )}
            {isEditing ? "Save Profile" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          {/* Eligibility Status Card */}
          <div
            className={`flex items-center justify-between rounded-xl p-4 md:col-span-3 ${
              eligibility.canDonate
                ? "border border-green-200 bg-green-100 text-green-800"
                : "border border-amber-200 bg-amber-100 text-amber-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {eligibility.canDonate ? <CheckCircle /> : <AlertCircle />}
              <div>
                <p className="text-lg font-bold">
                  {eligibility.canDonate
                    ? "Available to Donate"
                    : "Waiting Period"}
                </p>
                <p className="text-sm">
                  {eligibility.canDonate
                    ? "You are healthy and eligible to save a life today!"
                    : `You can donate again in ${eligibility.daysRemaining} days.`}
                </p>
              </div>
            </div>
            {eligibility.canDonate && (
              <Button className="border-none bg-green-600 text-white hover:bg-green-700">
                List as Available
              </Button>
            )}
          </div>

          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Health Information
            </h3>

            <div className="flex items-center gap-3">
              <Droplet className="text-red-500" />
              <div className="w-full">
                <p className="text-sm text-slate-400">Blood Group</p>
                {isEditing ? (
                  <select
                    name="bloodGroup"
                    value={donorData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full rounded border p-1 dark:bg-slate-800"
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                ) : (
                  <p className="text-xl font-bold text-red-600">
                    {donorData.bloodGroup}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-slate-400" />
              <div className="w-full">
                <p className="text-sm text-slate-400">Last Donation Date</p>
                {isEditing ? (
                  <Input
                    type="date"
                    name="lastDonationDate"
                    value={donorData.lastDonationDate}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="font-medium">
                    {donorData.lastDonationDate || "Never Donated"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Middle Column: Personal Info */}
          <div className="space-y-6 border-x border-slate-100 px-6 dark:border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Personal Details
            </h3>

            <div>
              <p className="text-sm text-slate-400">Age & Gender</p>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    name="age"
                    type="number"
                    value={donorData.age}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="gender"
                    value={donorData.gender}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <p className="font-medium">
                  {donorData.age} Years, {donorData.gender}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-slate-400" />
              <div className="w-full">
                <p className="text-sm text-slate-400">Location</p>
                {isEditing ? (
                  <div className="mt-1 space-y-2">
                    <Input
                      name="city"
                      placeholder="City"
                      value={donorData.city}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="area"
                      placeholder="Area"
                      value={donorData.area}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <p className="font-medium">
                    {donorData.area}, {donorData.city}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contact Details
            </h3>

            <div className="flex items-center gap-3">
              <Phone className="text-slate-400" size={18} />
              <div className="w-full">
                <p className="text-sm text-slate-400">Phone</p>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={donorData.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="font-medium">{donorData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-slate-400" size={18} />
              <div className="w-full">
                <p className="text-sm text-slate-400">Email Address</p>
                {isEditing ? (
                  <Input
                    name="email"
                    value={donorData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="font-medium">{donorData.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer/Action */}
        <div className="bg-slate-50 p-6 text-center dark:bg-slate-800/50">
          <p className="text-xs text-slate-500">
            By being a donor, you agree to be contacted by people in medical
            emergencies. Keep your location and phone number updated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
