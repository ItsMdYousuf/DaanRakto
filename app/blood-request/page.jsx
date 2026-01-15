"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Droplet,
  Hospital,
  MapPin,
  Plus,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";

const BloodRequestSystem = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      bloodGroup: "B+",
      quantity: "2 Bags",
      urgency: "Emergency",
      hospital: "City Medical College",
      location: "Dhaka, Bangladesh",
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      status: "Pending",
      contact: "+880123456789",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    bloodGroup: "A+",
    quantity: "1 Bag",
    urgency: "Normal",
    hospital: "",
    location: "",
    hoursToExpire: "24",
  });

  // Handle Request Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const request = {
      id: Date.now(),
      ...newRequest,
      expiresAt: new Date(
        Date.now() + parseInt(newRequest.hoursToExpire) * 3600000,
      ).toISOString(),
      status: "Pending",
    };
    setRequests([request, ...requests]);
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Active Blood Requests
          </h1>
          <p className="text-slate-500">
            Manage or create emergency blood requirements
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Request
        </Button>
      </div>

      {/* --- Create Request Form --- */}
      {showForm && (
        <div className="mb-10 rounded-xl border-2 border-red-100 bg-white p-6 shadow-xl duration-300 animate-in fade-in zoom-in dark:bg-slate-900">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Droplet className="text-red-600" /> New Blood Requirement
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div>
              <label className="text-sm font-medium">Blood Group</label>
              <select
                className="mt-1 w-full rounded border p-2 dark:bg-slate-800"
                onChange={(e) =>
                  setNewRequest({ ...newRequest, bloodGroup: e.target.value })
                }
              >
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                  (bg) => (
                    <option key={bg}>{bg}</option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantity (Bags)</label>
              <Input
                placeholder="e.g. 2 Bags"
                onChange={(e) =>
                  setNewRequest({ ...newRequest, quantity: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Urgency Level</label>
              <select
                className="mt-1 w-full rounded border p-2 dark:bg-slate-800"
                onChange={(e) =>
                  setNewRequest({ ...newRequest, urgency: e.target.value })
                }
              >
                <option value="Normal">Normal</option>
                <option value="Emergency">🚨 Emergency</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">
                Hospital Name & Address
              </label>
              <Input
                placeholder="Enter hospital details"
                onChange={(e) =>
                  setNewRequest({ ...newRequest, hospital: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Expires in (Hours)</label>
              <Input
                type="number"
                defaultValue="24"
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    hoursToExpire: e.target.value,
                  })
                }
              />
            </div>
            <div className="mt-2 flex justify-end gap-2 md:col-span-3">
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 text-white">
                Post Request
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* --- Request Feed --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {requests.map((req) => (
          <RequestCard key={req.id} req={req} setRequests={setRequests} />
        ))}
      </div>
    </div>
  );
};

// Sub-Component: Individual Request Card
const RequestCard = ({ req, setRequests }) => {
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(req.expiresAt) - new Date();
      if (distance < 0) {
        setTimeLeft("Expired");
        clearInterval(timer);
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [req.expiresAt]);

  const updateStatus = (newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: newStatus } : r)),
    );
  };

  return (
    <div
      className={`relative rounded-2xl border-l-8 bg-white p-5 shadow-md transition-all hover:shadow-lg dark:bg-slate-900 ${
        req.urgency === "Emergency" ? "border-l-red-600" : "border-l-slate-300"
      }`}
    >
      {/* Urgency Badge */}
      <div className="mb-4 flex items-start justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
            req.urgency === "Emergency"
              ? "animate-pulse bg-red-100 text-red-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {req.urgency}
        </span>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Timer size={14} />
          <span>{timeLeft}</span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50">
          <span className="text-2xl font-black text-red-600">
            {req.bloodGroup}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold leading-tight">
            {req.quantity} Required
          </h3>
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <Hospital size={14} /> {req.hospital}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-1 text-sm text-slate-400">
        <MapPin size={14} /> {req.location}
      </div>

      {/* Action Buttons based on status */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              req.status === "Pending"
                ? "bg-amber-500"
                : req.status === "Accepted"
                  ? "bg-blue-500"
                  : "bg-green-500"
            }`}
          />
          <span className="text-sm font-semibold">{req.status}</span>
        </div>

        <div className="flex gap-2">
          {req.status === "Pending" && (
            <Button
              size="sm"
              variant="outline"
              className="border-blue-600 text-blue-600"
              onClick={() => updateStatus("Accepted")}
            >
              I will Donate
            </Button>
          )}
          {req.status === "Accepted" && (
            <Button
              size="sm"
              className="bg-green-600 text-white"
              onClick={() => updateStatus("Completed")}
            >
              <CheckCircle2 className="mr-1 h-4 w-4" /> Mark Completed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodRequestSystem;
