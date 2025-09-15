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
import GeneralSocialMediaForm from "@/components/restaurant/social-media/GeneralSocialMediaForm";
import { getAllMenuItems } from "@/actions/menu/api";
import BranchSocialMediaForm from "@/components/restaurant/social-media/BranchSocialMediaForm";



export default function CreateCatering() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [allBranches, setAllBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
   const updatedData = null;
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [branches] = await Promise.all([
          getAllBranches(),
          getAllMenuItems()

        ]);
          console.log(branches,'all branches that are fetched')
        // setPermissions(permissionsRes);
        setAllBranches(branches?.data || []);
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
console.log(allBranches,'all branhces list')
  return (
    <div className="container py-5">
        <BranchSocialMediaForm
        updatedData={updatedData}
          allBranches={allBranches}
          onSuccess={() => router.push("/dashboard/restaurant/social-media")}
        />

    </div>
  );
}
