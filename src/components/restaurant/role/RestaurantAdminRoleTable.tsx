"use client";
import { useEffect,useMemo,useState } from "react";
import SafeRestaurantImage from "@/components/custome/shared/SafeImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn-ui table is here
import { useRouter } from "@/i18n/navigation";

import { Restaurant, RoleData, RoleResponse } from "@/types";
import Image from "next/image";
import Fuse from "fuse.js";
import { Edit, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteRoles, getAllRestuarantPermissions } from "@/actions/role/api";
import RoleForm from "./RestaurantRoleForm";
import { RoleTag,Permission } from "@/types";
import { useTranslations } from "next-intl";

interface SuperAdminRoleTableProps {
  data: RoleData[];
}

export default function RestaurantsTable({ data }: SuperAdminRoleTableProps) {
  const [searchRes, setSearchRes] = useState("");
  const [localRoles, setLocalRestaurants] = useState(data ?? []);
  const [editRole, setEditRole] = useState<any | null>(null);
  const [detailRole, setDetailRole] = useState<any | null>(null);
  const t=useTranslations('full')
  const [role_tags, setRoleTags] = useState<RoleTag[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [menuDelete,setMenuDelete] = useState(false);
           const [confirmDelete, setConfirmDelete] = useState<{ id: string ,name:string} | null>(null);

  const fuse = useMemo(() => {
    return new Fuse(localRoles, {
      keys: ["restaurant_name", "status"],
      threshold: 0.4,
    });
  }, [localRoles]);

  // const filterdRestaurants = searchRes
  //   ? fuse.search(searchRes).map((result) => result.item)
  //   : localRestaurants;
    const handleCloseModal = () => {
    setEditRole(null);
    router.refresh();
  };
      const handleCloseDetailModal = () => {
    setDetailRole(null);
  };
  const handleEditClick = (role: any) => {
    setEditRole(role);
      setDetailRole(null);

  };
    const handleDetailClick = (role: any) => {
      setEditRole(null);
    setDetailRole(role);
  };
      const handleDelete = async (id: any) => {
    try {

      const response = await deleteRoles(id);
      if (response?.success) {
        setMenuDelete(false); 
    router.refresh();
        toast.success("Role deleted successfully");

        setLocalRestaurants((prev:any) => prev.filter((item:any) => item.id !== id));
      } else {
        toast.error(response.message || "Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    }
  }

    useEffect(() => {
      async function fetchPermissions() {
        try {
          const [ allPerms] = await Promise.all([
            // getAllRoleTags(),
            getAllRestuarantPermissions(),
          ]);
          // setRoleTags(roleTags);
          setPermissions(allPerms);
  
          const data: Permission[] = await getAllRestuarantPermissions();
          setPermissions(data);
        } catch (err) {
          console.error("Error fetching permissions:", err);
          toast.error("Faild to fetch permissions");
        } finally {
          setLoading(false);
        }
      }
      fetchPermissions();
    }, []);
  

  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">
        {/* <div className="relative flex flex-4/5 items-center">
          <SearchIcon className="absolute left-2 size-4" />
          <Input
            className="bg-muted h-12 pl-8 text-sm"
            placeholder="Search Roles"
            value={searchRes}
            onChange={(e) => setSearchRes(e.target.value)}
          />
        </div> */}
        <div className="w-full">
          <Link href="/dashboard/restaurant/role/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              {t("Create")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>{t("number")}.</TableHead>
              <TableHead>{t("Role Name")}</TableHead>
              <TableHead>{t("Description")}</TableHead>
              <TableHead>{t("Role Tag")}</TableHead>
              <TableHead>{t("Restaurant Name")}</TableHead>
              <TableHead>{t("Permission Count")}</TableHead>
              {/* <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead> */}
              <TableHead>{t("Action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((role, index) => {
              return (
                <TableRow
                  key={role.id}
                  className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell className="font-medium">
                    {role.description}
                  </TableCell>
                  <TableCell>{role.role_tag?.name}</TableCell>
                  <TableCell>{role.restaurant_name ?? "Unknown"}</TableCell>

                  <TableCell>{role.permission_count}</TableCell>

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
                                         <DropdownMenuItem className="cursor-pointer" onClick={() => handleDetailClick(role)}>
                                                    Detail
                        </DropdownMenuItem>
                   <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditClick(role)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem     onClick={()=>setConfirmDelete({id:role?.id,name:role?.name})}
                           className="cursor-pointer">
                        
                          
                          
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


        <div>
            {confirmDelete && (
              <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                  <p className="mb-4">Are you sure you want to delete {confirmDelete.name} ?</p>
                  <div className="flex justify-end space-x-2">  
                    <Button
                      variant="outline"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {    

                        handleDelete(confirmDelete?.id)
                        setMenuDelete(true);
                        setConfirmDelete(null);
                      } 
}
                    >
                      Confirm Delete
                    </Button>

                  </div>
                  </div>
                  </div>)

                  }


                  
                        {editRole && (
                          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
                            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                              <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="text-lg font-bold">Edit Branch</h2>
                                <Button variant="ghost" onClick={handleCloseModal}>
                                  Close
                                </Button>
                              </div>
                              <div className="p-6">
                                <RoleForm
                                  role={editRole}
                                      allPermissions={permissions}
                                       allRoleTags={role_tags}
                                  onSuccess={() => {
                                    handleCloseModal();
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}



                           {detailRole && (
                                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
                                  <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                                    <div className="flex justify-between items-center p-4 border-b">
                                      <h2 className="text-lg font-bold">View Role</h2>
                                      <Button variant="ghost" onClick={handleCloseDetailModal}>
                                        Close
                                      </Button>
                                    </div>
                                    <div className="flex flex-col p-6 text-black dark:text-white space-y-2">
                                      <div className="flex flex-row items-center gap-2">
                                          <p className="flex text-bold">Name:</p>
                                          <p className="flex text-sm">{detailRole?.name || '-'}</p>
                                        </div>
                                             <div className="flex flex-row items-center gap-2">
                                          <p className="flex text-bold">Description:</p>
                                          <p className="flex text-sm">{detailRole?.description || '-'}</p>
                                        </div>
                                                <div className="flex flex-row items-center gap-2">
                                          <p className="flex text-bold">Permissions:</p>
                                          <div className="flex text-sm  gap-8">{detailRole?.permissions.map((permission:any)=>
                                                                                   <p key={permission?.id} className="flex text-sm">{permission?.name || '-'} </p>

                                          )}</div>
                                        </div>
                                    </div>
                                  </div>
                                </div>
                              )}
          </div>
    </>
  );
}
