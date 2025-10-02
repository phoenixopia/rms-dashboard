"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

import { getAllBranches } from "@/actions/branch/api";
// import { getAllRestaurantPermissions } from "@/actions/role/api";
import RestraurantSupportTicketForm from "@/components/restaurant/support-ticket/RestaurantSupportTicketForm";
import { Permission } from "@/types";

import MenuCategoriesForm from "@/components/restaurant/menu-categories/MenuCategoriesForm";
import CateringForm from "@/components/restaurant/catering/CateringForm";
import RestaurantTabelForm from "@/components/restaurant/tables/RestaurantTabelForm";

export default function CreateSupportTicket() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [allBranches, setAllBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [ branchesRes] = await Promise.all([
          // getAllRestaurantPermissions(),
          getAllBranches(),
        ]);

        // setPermissions(permissionsRes);
        setAllBranches(branchesRes?.data || []);
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

  return (
    <div className="container py-5">
        <RestraurantSupportTicketForm
    
          onSuccess={() => router.push("/dashboard/restaurant/support-ticket")}
        />

    </div>
  );
}
