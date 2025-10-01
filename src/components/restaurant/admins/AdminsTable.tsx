"use client"; 
import { useEffect,useState,useMemo } from "react";
import { RoleData } from "@/types";
import { useTranslations } from "next-intl";
import { getAllRoles } from "@/actions/role/api";
import SafeRestaurantImage from "@/components/custome/shared/SafeImage";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn-ui table is here
import { User } from "@/types";
// import Image from "next/image";

import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateRestaurantStaffForm } from "./CreateRestaurantStaffForm";
import { UpdateRestaurantStaffForm } from "./UpdateRestaurantStaffForm";
import { deleteMenuItem } from "@/actions/menu/api";
import { deleteUser } from "@/actions/user/api";

interface AdminTableProps {
  users: User[];
}

export default function AdminsTable({ users }: any) {
  const [searchRes, setSearchRes] = useState("");
  const [editStaff, setEditStaff] = useState<any | null>(null);
   const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
   const router =useRouter()
  const [localRestaurants, setLocalRestaurants] = useState(users ?? []);
 const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("full");

  const fuse = useMemo(() => {
    return new Fuse(localRestaurants, {
      keys: ["restaurant_name", "status"],
      threshold: 0.4,
    });
  }, [localRestaurants]);

  const filterdRestaurants = searchRes
    ? fuse.search(searchRes).map((result) => result.item)
    : localRestaurants;
      const handleEditClick = (staff: any) => {
    setEditStaff(staff);
  };
    const handleCloseModal = () => {
    setEditStaff(null);
  };
  useEffect(() => {
    async function fetchRoles() {
      try {
        const roleData: any = await getAllRoles();
        setRoles(roleData?.data?.roles || []);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        toast.error("Faild to fetch permissions");
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">
        {/* <div className="relative flex flex-4/5 items-center">
          <SearchIcon className="absolute left-2 size-4" />
          <Input
            className="bg-muted h-12 pl-8 text-sm"
            placeholder="Search staffs"
            value={searchRes}
            onChange={(e) => setSearchRes(e.target.value)}
          />
        </div> */}
        <div className="w-full">
          <Link href="/dashboard/restaurant/staff/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              {t("Create")}
            </Button>
          </Link>
        </div>
      </div>
      {users.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>{t("number")}.</TableHead>
                <TableHead>{t("Profile")}</TableHead>
                <TableHead>{t("Full Name")}</TableHead>
                <TableHead>{t("Email")}</TableHead>
                <TableHead>{t("Phone")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("Role")}</TableHead>
                <TableHead>{t("Permission Count")}</TableHead>
                <TableHead>{t("Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user:any, index:any) => {
                return (
                  <TableRow
                    key={user?.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {user?.profile_picture && (
                        <SafeRestaurantImage
                          src={user?.profile_picture}
                          alt={`${user?.first_name} logo`}
                        />
                      )}
                    </TableCell>
                    <TableCell>{user?.first_name} {user?.last_name}</TableCell>

                    <TableCell>{user?.email ?? "N/A"}</TableCell>
                    <TableCell>{user?.phone_number ?? "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded px-2 py-1 text-sm font-medium ${user?.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {user?.is_active ? "Active" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>{user?.Role?.name || '-'}</TableCell>

                    <TableCell>{user?.Role?.total_permission}</TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className="cursor-pointer rounded-sm bg-[#FF7632] px-3 py-1 text-sm text-white">
                            Action
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-background">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {/* <DropdownMenuItem className="cursor-pointer">
                            <Link href="#">Detail</Link>
                          </DropdownMenuItem> */}
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditClick(user)}>
                          Edit
                        </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" 
                              onClick={() => setDeleteItemId(user?.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
      )}
      <div>
              {editStaff && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
                  <div className="flex  flex-col w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                    <div className="flex justify-between items-center p-4 border-b">
                      <h2 className="text-lg font-bold">Edit Staff</h2>
                      <Button variant="ghost" onClick={handleCloseModal}>
                        Close
                      </Button>
                    </div>
                    <div className="p-6">
                
                      <UpdateRestaurantStaffForm
                         roles={roles}
                        staffData={editStaff}
                        onSuccess={() => {
                          handleCloseModal();
                           router.refresh()

                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
      </div>

      <div>
        {deleteItemId && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
              <h2 className="text-lg font-semibold">Confirm Deletion</h2>
              <p>Are you sure you want to delete this user?</p>
        
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteItemId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      const res = await deleteUser(deleteItemId);
                      if (res.success) {
                        toast.success("User deleted successfully");
                           router.refresh()
                      } else {
                        toast.error(res.message || "Failed to delete user");
                      }
                    } catch (err) {
                      toast.error("Unexpected error during deletion");
                    } finally {
                      setDeleteItemId(null);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
    
  );
}
