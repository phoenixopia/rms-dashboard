"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getAuthToken } from "@/auth/auth";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;


export default function InventoryUpdatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams(); // id from [id]
  const inventoryId = params.id;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    threshold: "",
  });

  const [selectedUnit, setSelectedUnit] = useState("Kilogram(kg)");
  const units = ["Kilogram(kg)", "Piece(pcs)", "Gram(g)", "Liter(L)", "Ton(t)", "Milliliter(ml)"];

  // Fetch inventory item
  const fetchItem = async () => {
    try {
      const token = await getAuthToken();
      const res = await axios.get(`${API_BASE}/inventory/get-inventory/${inventoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data;
      setForm({
        name: data.name || "",
        quantity: String(data.quantity || ""),
        threshold: String(data.threshold || ""),
      });
      setSelectedUnit(data.unit || "Kilogram(kg)");
    } catch (err) {  
      toast.error("Failed to fetch inventory item");
    }
  };

  useEffect(() => {
    fetchItem();
  }, [inventoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      await axios.put(
        `${API_BASE}/inventory/update-inventory/${inventoryId}`,
        {
          name: form.name,
          unit: selectedUnit,
          quantity: Number(form.quantity),
          threshold: Number(form.threshold),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Inventory updated successfully");

      // Navigate back to inventory page (preserve locale/dashboard path)
      const basePath = pathname.split("/inventory")[0];
      router.push(`${basePath}/inventory`);
    } catch (err) {
      toast.error("Failed to update inventory item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Inventory Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
              <Select value={selectedUnit} onValueChange={(val) => setSelectedUnit(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit, idx) => (
                    <SelectItem key={idx} value={unit}>
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

            {/* Update Button */}
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update Inventory"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
