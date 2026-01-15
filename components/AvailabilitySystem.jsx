"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle,
  Info,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const AvailabilitySystem = () => {
  // 1. Data states (In a real app, fetch these from your DB)
  const [lastDonationDate, setLastDonationDate] = useState("2023-11-20");
  const [manualStatus, setManualStatus] = useState(true); // User's toggle
  const [countdown, setCountdown] = useState({ days: 0, percentage: 0 });

  const WAITING_DAYS = 90; // Standard 3-month interval (adjust as needed)

  // 2. Logic: Calculate Eligibility and Countdown
  useEffect(() => {
    if (!lastDonationDate) return;

    const calculateEligibility = () => {
      const today = new Date();
      const lastDate = new Date(lastDonationDate);

      // Calculate next eligible date
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + WAITING_DAYS);

      const diffTime = nextDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Calculate percentage for a progress bar
      const daysSince = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      const progress = Math.min(
        100,
        Math.max(0, (daysSince / WAITING_DAYS) * 100),
      );

      setCountdown({
        days: diffDays > 0 ? diffDays : 0,
        percentage: progress,
        nextDate: nextDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });
    };

    calculateEligibility();
    const timer = setInterval(calculateEligibility, 3600000); // Update every hour
    return () => clearInterval(timer);
  }, [lastDonationDate]);

  const isMedicallyEligible = countdown.days === 0;
  const isPubliclyAvailable = manualStatus && isMedicallyEligible;

  // 3. Handle "I Donated Today" Action
  const handleMarkAsDonated = () => {
    const today = new Date().toISOString().split("T")[0];
    // In real life: Update this in your Database via API
    setLastDonationDate(today);
    alert("System updated! You are now in a resting period.");
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Top Status Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold">Your Status</h3>
          <Badge
            className={
              isPubliclyAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {isPubliclyAvailable ? "VISIBLE TO PATIENTS" : "HIDDEN FROM SEARCH"}
          </Badge>
        </div>

        {/* Manual Toggle */}
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <Info size={18} className="text-slate-400" />
            <div>
              <p className="text-sm font-bold">Manual Availability</p>
              <p className="text-xs text-slate-500">
                Go offline to stop receiving calls
              </p>
            </div>
          </div>
          <button
            onClick={() => setManualStatus(!manualStatus)}
            className="transition-transform focus:outline-none active:scale-90"
          >
            {manualStatus ? (
              <ToggleRight size={44} className="fill-current text-green-500" />
            ) : (
              <ToggleLeft size={44} className="text-slate-300" />
            )}
          </button>
        </div>

        {/* Medical Countdown Section */}
        {!isMedicallyEligible ? (
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
              <span>Resting Period</span>
              <span>{countdown.days} Days Left</span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full bg-red-500 transition-all duration-1000 ease-out"
                style={{ width: `${countdown.percentage}%` }}
              />
            </div>

            <p className="flex items-center gap-1 text-[11px] text-slate-500">
              <Calendar size={12} /> Next Eligibility:{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {countdown.nextDate}
              </span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-green-200 p-4 text-center">
            <CheckCircle className="text-green-500" size={32} />
            <p className="text-sm font-medium">
              You are medically ready to donate!
            </p>
          </div>
        )}

        {/* Action Button: Reset after Donation */}
        {isMedicallyEligible && (
          <Button
            onClick={handleMarkAsDonated}
            className="mt-6 w-full rounded-2xl bg-red-600 py-6 font-bold text-white shadow-lg shadow-red-200 hover:bg-red-700"
          >
            I Donated Today
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySystem;
