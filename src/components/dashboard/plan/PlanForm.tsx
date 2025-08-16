// src/components/plans/PlanForm.tsx
"use client";

import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPlanSchema,
  CreatePlanValues,
  PLAN_NAMES,
  BILLING_CYCLES,
  DATA_TYPES,
} from "@/schemas/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/i18n/navigation";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

type PlanFormProps = {
  defaultValues?: Partial<CreatePlanValues>;
  onSubmit: (values: CreatePlanValues) => Promise<void>;
  isLoading?: boolean;
};

export default function PlanForm({
  defaultValues,
  onSubmit,
  isLoading,
}: PlanFormProps) {
  const form = useForm<CreatePlanValues>({
    resolver: zodResolver(createPlanSchema) as Resolver<CreatePlanValues>,
    defaultValues: {
      name: "Basic",
      billing_cycle: "monthly",
      plan_limits: [],
      price: 0,
      ...defaultValues,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "plan_limits",
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (form.formState.errors) {
        console.log("Form errors:", form.formState.errors);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.formState.errors]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-start gap-4 py-10"
    >
      <div className="flex w-4/6 justify-between gap-2 lg:w-3/6">
        <p className="text-lg font-bold lg:text-2xl">Create Restaurant Admin</p>
        <Link href="/dashboard/superadmin/plan">
          <Button variant="outline" className="cursor-pointer">
            Cancel
          </Button>
        </Link>
      </div>
      {/* Name */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="name">Plan Name</Label>
        <Select
          value={form.watch("name")}
          onValueChange={(v) => form.setValue("name", v as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select plan name" />
          </SelectTrigger>
          <SelectContent>
            {PLAN_NAMES.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="price">Price</Label>
        <Input
          type="number"
          step="0.01"
          {...register("price", {
            valueAsNumber: true,
            required: "Price is required",
          })}
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      {/* Billing Cycle */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="billing_cycle">Billing Cycle</Label>
        <Select
          value={form.watch("billing_cycle")}
          onValueChange={(v) => form.setValue("billing_cycle", v as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select billing cycle" />
          </SelectTrigger>
          <SelectContent>
            {BILLING_CYCLES.map((cycle) => (
              <SelectItem key={cycle} value={cycle}>
                {cycle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Plan Limits */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label>Plan Limits</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              placeholder="Key"
              {...register(`plan_limits.${index}.key`)}
            />
            <Input
              placeholder="Value"
              {...register(`plan_limits.${index}.value`)}
            />
            {errors.plan_limits?.[index]?.value && (
              <p className="text-sm text-red-500">
                {errors.plan_limits[index]?.value?.message}
              </p>
            )}
            <Select
              value={form.watch(`plan_limits.${index}.data_type`)}
              onValueChange={(v) =>
                form.setValue(`plan_limits.${index}.data_type`, v as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Data type" />
              </SelectTrigger>
              <SelectContent>
                {DATA_TYPES.map((dt) => (
                  <SelectItem key={dt} value={dt}>
                    {dt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ key: "", value: "", data_type: "string" })}
        >
          + Add Limit
        </Button>
      </div>
      {Object.keys(errors).length > 0 && (
        <div className="w-4/6 text-red-500 lg:w-3/6">
          <h3 className="font-bold">Form Errors:</h3>
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        </div>
      )}

      {/* Submit */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Plan"}
      </Button>
    </form>
  );
}
