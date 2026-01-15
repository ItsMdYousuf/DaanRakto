// components/auth/RegisterForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export function RegisterForm() {
  const [step, setStep] = useState(1); // 1: Role, 2: Info, 3: Verify
  const [userType, setUserType] = useState("DONOR");

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl border bg-white p-6 shadow-lg dark:bg-slate-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Join LifeBlood</h2>
        <p className="text-slate-500">Step {step} of 3</p>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Label>I want to...</Label>
          <RadioGroup
            defaultValue="DONOR"
            onValueChange={setUserType}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="DONOR"
                id="donor"
                className="peer sr-only"
              />
              <Label
                htmlFor="donor"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-red-600"
              >
                <span>Donate Blood</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="RECIPIENT"
                id="recipient"
                className="peer sr-only"
              />
              <Label
                htmlFor="recipient"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-red-600"
              >
                <span>Find Blood</span>
              </Label>
            </div>
          </RadioGroup>
          <Button className="w-full bg-red-600" onClick={() => setStep(2)}>
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Input placeholder="Full Name" />
          <Input placeholder="Email or Phone Number" />
          <Input type="password" placeholder="Create Password" />
          {userType === "DONOR" && (
            <select className="w-full rounded-md border p-2 dark:bg-slate-800">
              <option>Select Blood Group</option>
              <option>A+</option>
              <option>O-</option>
              {/* ...others */}
            </select>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1 bg-red-600">Register</Button>
          </div>
        </div>
      )}
    </div>
  );
}
