"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

import { getAllBranches } from "@/actions/branch/api";
// import { getAllRestaurantPermissions } from "@/actions/role/api";

import { Permission } from "@/types";

import MenuCategoriesForm from "@/components/restaurant/menu-categories/MenuCategoriesForm";
import CateringForm from "@/components/restaurant/catering/CateringForm";
import SubscriptionForm from "@/components/restaurant/subscription/SubscriptionForm";
import { getAllPlans } from "@/actions/susbscriptions/api";

export default function CreateCatering() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [allPLans, setAllPLans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [ plansResponse] = await Promise.all([
          // getAllRestaurantPermissions(),
          getAllPlans(),
        ]);

        // setPermissions(permissionsRes);
        setAllPLans(plansResponse?.data?.plans || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
console.log(allPLans,'all plans listssss')
  return (
    <div className="container py-5">
        <SubscriptionForm
          allPlansList={allPLans}
          onSuccess={() => router.push("/dashboard/restaurant/subscription")}
        />

    </div>
  );
}
