"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthToken } from "@/auth/auth";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InventoryForm() {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    threshold: "",
  });

  const [selectedUnit, setSelectedUnit] = useState("Kilogram(kg)");
  const units = [
    "Kilogram(kg)",
    "Piece(pcs)",
    "Gram(g)",
    "Liter(L)",
    "Ton(t)",
    "Milliliter(ml)",
  ];

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authToken = await getAuthToken(); // 🔑 get JWT

      const res = await fetch(
        "https://rms1-backend.vercel.app/api/v1/admin/inventory/create-inventory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // ✅ secure request
          },
          body: JSON.stringify({
            name: form.name,
            unit: selectedUnit, // ✅ fixed here
            quantity: Number(form.quantity),
            threshold: Number(form.threshold),
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create inventory item");
      }

      await res.json();

      toast.success(" Inventory created successfully");

      // Reset form
      setForm({ name: "", quantity: "", threshold: "" });
      setSelectedUnit("Kilogram(kg)");
    } catch (error: any) {
      console.log("error creating feature ");
      toast.error(" Failed to create inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Inventory Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium">Item Name</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </div>

            {/* Unit Selection */}
            <div>
              <label className="block text-sm font-medium">Unit</label>
              <Select
                value={selectedUnit}
                onValueChange={(value) => setSelectedUnit(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit, index) => (
                    <SelectItem key={index} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <Input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 200"
                required
              />
            </div>

            {/* Threshold */}
            <div>
              <label className="block text-sm font-medium">Threshold</label>
              <Input
                name="threshold"
                type="number"
                value={form.threshold}
                onChange={handleChange}
                placeholder="e.g. 12"
                required
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
