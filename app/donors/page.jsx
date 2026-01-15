"use client";
import {
  Calendar,
  CheckCircle,
  Clock,
  Droplets,
  Filter,
  Heart,
  Info,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// --- Custom UI Components (to replace @/components/ui) ---
const Badge = ({ children, className }) => (
  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const Button = ({ children, onClick, className, variant = "primary" }) => {
  const base =
    "px-4 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-100",
    outline: "border-2 border-slate-200 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100",
  };
  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Mock Data ---
const MOCK_DONORS = [
  {
    id: 1,
    name: "Sarah Johnson",
    type: "O+",
    location: "Downtown Medical Center",
    distance: "2.4 km",
    verified: true,
    lastDonation: "2023-08-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    type: "A-",
    location: "Westside Clinic",
    distance: "5.1 km",
    verified: true,
    lastDonation: "2024-01-10",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    type: "B+",
    location: "Eastside Health",
    distance: "0.8 km",
    verified: false,
    lastDonation: "2023-11-20",
  },
  {
    id: 4,
    name: "David Smith",
    type: "AB+",
    location: "St. Jude Hospital",
    distance: "12.0 km",
    verified: true,
    lastDonation: "2023-05-22",
  },
  {
    id: 5,
    name: "Aisha Patel",
    type: "O-",
    location: "Central Plaza",
    distance: "3.2 km",
    verified: true,
    lastDonation: "2024-02-01",
  },
];

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// --- Availability System Component (Modified for integration) ---
const MyStatusCard = ({
  lastDonationDate,
  setLastDonationDate,
  manualStatus,
  setManualStatus,
}) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    percentage: 0,
    nextDate: "",
  });
  const WAITING_DAYS = 90;

  useEffect(() => {
    if (!lastDonationDate) return;
    const calculateEligibility = () => {
      const today = new Date();
      const lastDate = new Date(lastDonationDate);
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + WAITING_DAYS);

      const diffTime = nextDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
    const timer = setInterval(calculateEligibility, 3600000);
    return () => clearInterval(timer);
  }, [lastDonationDate]);

  const isMedicallyEligible = countdown.days === 0;
  const isPubliclyAvailable = manualStatus && isMedicallyEligible;

  const handleMarkAsDonated = () => {
    const today = new Date().toISOString().split("T")[0];
    setLastDonationDate(today);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
          <Clock size={18} className="text-red-500" />
          My Donor Status
        </h3>
        <Badge
          className={
            isPubliclyAvailable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        >
          {isPubliclyAvailable ? "ACTIVE" : "INACTIVE"}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-slate-700">
              {manualStatus ? (
                <ToggleRight className="text-green-500" />
              ) : (
                <ToggleLeft className="text-slate-300" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold">Public Visibility</p>
              <p className="text-[10px] text-slate-500">
                Toggle to receive requests
              </p>
            </div>
          </div>
          <button
            onClick={() => setManualStatus(!manualStatus)}
            className="focus:outline-none"
          >
            {manualStatus ? (
              <ToggleRight size={40} className="text-green-500" />
            ) : (
              <ToggleLeft size={40} className="text-slate-300" />
            )}
          </button>
        </div>

        {!isMedicallyEligible ? (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
              <span>Next eligible in</span>
              <span>{countdown.days} Days</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full bg-red-500 transition-all duration-1000"
                style={{ width: `${countdown.percentage}%` }}
              />
            </div>
            <p className="flex items-center gap-1 text-[10px] text-slate-500">
              <Calendar size={10} /> Ready on: {countdown.nextDate}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-3">
            <CheckCircle className="text-green-500" size={20} />
            <p className="text-xs font-medium text-green-800">
              Medically fit to donate today
            </p>
          </div>
        )}

        {isMedicallyEligible && (
          <Button onClick={handleMarkAsDonated} className="w-full py-3 text-sm">
            I Donated Today
          </Button>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [searchType, setSearchType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("find"); // 'find' or 'status'

  // User availability state
  const [lastDonationDate, setLastDonationDate] = useState("2023-11-20");
  const [manualStatus, setManualStatus] = useState(true);

  const filteredDonors = useMemo(() => {
    return MOCK_DONORS.filter((donor) => {
      const matchesType = searchType === "" || donor.type === searchType;
      const matchesSearch =
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [searchType, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
              <Droplets className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight">LifeStream</span>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setView("find")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${view === "find" ? "bg-white shadow-sm dark:bg-slate-700" : "text-slate-500"}`}
            >
              Find Donors
            </button>
            <button
              onClick={() => setView("status")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${view === "status" ? "bg-white shadow-sm dark:bg-slate-700" : "text-slate-500"}`}
            >
              My Status
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 pt-6">
        {view === "status" ? (
          <div className="duration-500 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="mb-6 text-2xl font-black">Manage Your Profile</h2>
            <MyStatusCard
              lastDonationDate={lastDonationDate}
              setLastDonationDate={setLastDonationDate}
              manualStatus={manualStatus}
              setManualStatus={setManualStatus}
            />
            <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
              <h4 className="mb-2 flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300">
                <Info size={16} /> Guidelines
              </h4>
              <ul className="list-disc space-y-2 pl-4 text-sm text-blue-700 dark:text-blue-400">
                <li>Wait at least 90 days between whole blood donations.</li>
                <li>
                  Ensure you are well-hydrated and have eaten before donating.
                </li>
                <li>
                  Keep your visibility active only when you are able to travel.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="duration-500 animate-in fade-in slide-in-from-bottom-4">
            {/* Search Hero */}
            <div className="mb-8 space-y-4">
              <h1 className="text-3xl font-black tracking-tight">
                Find Blood Donors
              </h1>
              <p className="text-sm text-slate-500">
                Find and contact life-saving donors in your immediate area.
              </p>

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="group relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-red-500"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by name or hospital..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 shadow-sm outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-800 dark:bg-slate-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      className="cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white py-4 pl-10 pr-10 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-800 dark:bg-slate-900"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      {BLOOD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <Droplets
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
                      size={16}
                    />
                    <Filter
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={14}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-bold text-slate-400">
                  {filteredDonors.length} Donors found nearby
                </span>
                <button className="text-xs font-bold text-red-600 hover:underline">
                  View Map
                </button>
              </div>

              {filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="group flex flex-col items-start justify-between gap-4 rounded-3xl border border-l-4 border-slate-200 border-l-red-500 bg-white p-5 shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30">
                      <span className="text-xl font-black text-red-600">
                        {donor.type}
                      </span>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-lg font-bold transition-colors group-hover:text-red-600">
                          {donor.name}
                        </h3>
                        {donor.verified && (
                          <ShieldCheck
                            size={16}
                            className="text-blue-500"
                            fill="currentColor"
                            fillOpacity={0.2}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin size={14} /> {donor.location} •{" "}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {donor.distance}
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 py-0.5 text-green-700">
                            Ready to Donate
                          </Badge>
                          <span className="text-[10px] text-slate-400">
                            Last:{" "}
                            {new Date(donor.lastDonation).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full gap-2 md:w-auto">
                    <Button
                      variant="outline"
                      className="flex-1 p-3 md:flex-initial"
                    >
                      <MessageSquare size={18} />
                    </Button>
                    <Button className="flex-1 px-6 md:flex-initial">
                      <Phone size={18} />
                      Contact
                    </Button>
                  </div>
                </div>
              ))}

              {filteredDonors.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center dark:border-slate-700 dark:bg-slate-900/50">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Search className="text-slate-400" size={30} />
                  </div>
                  <h3 className="text-lg font-bold">No donors found</h3>
                  <p className="text-sm text-slate-500">
                    Try adjusting your filters or search area
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <button
          onClick={() => setView("find")}
          className={`flex flex-col items-center gap-1 ${view === "find" ? "text-red-600" : "text-slate-400"}`}
        >
          <Search size={22} />
          <span className="text-[10px] font-bold">Search</span>
        </button>
        <div className="relative -top-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#F8FAFC] bg-red-600 shadow-lg shadow-red-200 dark:border-slate-950">
            <Heart className="fill-current text-white" size={24} />
          </div>
        </div>
        <button
          onClick={() => setView("status")}
          className={`flex flex-col items-center gap-1 ${view === "status" ? "text-red-600" : "text-slate-400"}`}
        >
          <Clock size={22} />
          <span className="text-[10px] font-bold">My Status</span>
        </button>
      </nav>
    </div>
  );
}
