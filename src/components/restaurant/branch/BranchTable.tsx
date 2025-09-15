"use client";

import { useEffect, useState, useMemo } from "react";
import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import BranchForm from "./BranchForm"; // Make sure this path is correct
import { User } from "@/types";
import { deleteBranch } from "@/actions/branch/api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
interface AdminTableProps {
  data: User[];
}

export default function BranchTable(data: any) {
  const [searchRes, setSearchRes] = useState("");
  const [editBranch, setEditBranch] = useState<any | null>(null);
  const [localRestaurants, setLocalRestaurants] = useState(data ?? []);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [detailBranch, setDetailBranch] = useState<any | null>(null);
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;
    const router=useRouter()
    const t = useTranslations("full");
  const fuse = useMemo(() => {
    return new Fuse(localRestaurants, {
      keys: ["restaurant_name", "status"],
      threshold: 0.4,
    });
  }, [localRestaurants]);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: `${googleApiKey}`
    });

  const filteredRestaurants = searchRes
    ? fuse.search(searchRes).map((result) => result.item)
    : localRestaurants;

  const handleEditClick = (branch: any) => {
    setEditBranch(branch);
  };
      const handleDetailClick = (branch: any) => {
         setEditBranch(null);

         setDetailBranch(branch);
  };

  const handleCloseModal = () => {
    setEditBranch(null);
  };
   console.log(data?.data,'data of the branches')
  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">

        <div className="w-full">
          <Link href="/dashboard/restaurant/branch/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              {t("Create")}
            </Button>
          </Link>
        </div>
      </div>

      {data?.data?.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>{t("number")}.</TableHead>
                <TableHead>{t("Name")}</TableHead>
                <TableHead>{t("Restaurant")}</TableHead>
                <TableHead>{t("Location")}</TableHead>
                <TableHead>{t("Main Branch")}</TableHead>
                <TableHead>{t("Opening")}</TableHead>
                <TableHead>{t("Closing")}</TableHead>
                <TableHead>{t("Staffs")}</TableHead>
                <TableHead>{t("Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data?.data?.map((branch: any, index: number) => (
                <TableRow key={branch.id} className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{branch?.name}</TableCell>
                  <TableCell>{branch?.restaurant_name}</TableCell>
                  <TableCell>{branch?.location?.address}</TableCell>
                  <TableCell>{branch?.main_branch ? "Yes" : "No"}</TableCell>
                  <TableCell>{branch?.opening_time}</TableCell>
                  <TableCell>{branch?.closing_time}</TableCell>
                  <TableCell>{branch?.total_staffs}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <div className="cursor-pointer rounded-sm bg-[#FF7632] px-3 py-1 text-sm text-white">
                          {t("Action")}
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-background">
                        <DropdownMenuLabel>{t("Action")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleDetailClick(branch)}>
                                                    {t("Detail")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditClick(branch)}>
                            {t("Edit")}
                        </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" 
                              onClick={() => setDeleteItemId(branch?.id)}
                          >
                            {t("Delete")}
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {editBranch && (
        <div className="fixed inset-0 z-100 overflow-hidden flex items-center justify-center bg-black/60">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Edit Branch</h2>
              <Button variant="ghost" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
            <div className=" flex p-6">
              <BranchForm
                branch={editBranch}
                onSuccess={() => {
                  handleCloseModal();
                }}
              />
            </div>
          </div>
        </div>
      )}


             {deleteItemId && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
                    <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                    <p>Are you sure you want to delete this branch?</p>
              
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
                            const res = await deleteBranch(deleteItemId);
                            if (res.success) {
                              toast.success("Branch deleted successfully");
                               router.refresh()
                            } else {
                              toast.error(res.message || "Failed to delete branch");
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

                           {detailBranch && (
                                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
                                  <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                                    <div className="flex justify-between items-center p-4 border-b">
                                      <h2 className="text-lg font-bold">View Branch</h2>
                                      <Button variant="ghost" onClick={()=>setDetailBranch(null)}>
                                        Close
                                      </Button>
                                    </div>
                                    <div className="flex flex-col p-6 text-black dark:text-white space-y-2">
                                      <div className="flex flex-row items-center gap-2">
                                          <p className="flex text-bold">Branch Name:</p>
                                          <p className="flex text-sm">{detailBranch?.name || '-'}</p>
                                        </div>
                                             <div className="flex flex-row items-center gap-2">
                                          <p className="flex text-bold">Description:</p>
                                          <p className="flex text-sm">{detailBranch?.description || '-'}</p>
                                        </div>

                                             <div className="w-5/6 flex flex-col gap-2 col-span-2">
                                              <label>Branch Location</label>
                                       
                                              {isLoaded ? (
                                                <GoogleMap
                                                  mapContainerStyle={{ width: "100%", height: "25rem" }}
                                                  center={{ lat: parseFloat(detailBranch?.location?.latitude )|| 9.019100813742908 , lng: parseFloat(detailBranch?.location?.longitude )|| 38.801783780716995}}
                                                  zoom={14}
                                                >
                                                  <MarkerF
                                                    position={{ lat: parseFloat(detailBranch?.location?.latitude) || 9.019100813742908, lng: parseFloat(detailBranch?.location?.longitude) || 38.801783780716995 }}
                                               
                                                 
                                                  />
                                                </GoogleMap>
                                              ) : (
                                                <p className="text-center text-sm text-gray-800 dark:text-white">Loading map...</p>
                                              )}
                                            </div>
                              
                                    </div>
                                  </div>
                                </div>
                              )}
      
    </>
  );
}
