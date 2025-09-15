"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteMenu } from "@/actions/menu/api";
import { useRouter } from "@/i18n/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuForm from "./MenuForm"; // Import your form component

interface MenuTableProps {
  data: {
    id: string;
    name: string;
    total_categories: number;
    total_items: number;
  };
}

export default function MenuTable({ data }: MenuTableProps) {

  const router =useRouter()
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, name: string } | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  // If no menu data, show empty state with create button
  if (!data || !data.id) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="mb-4 text-lg">No menu found</h1>
        <Link href="/dashboard/restaurant/menu/new">
          <Button variant="outline" className="h-12 cursor-pointer font-bold">
            Create Menu
          </Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteMenu(id);
      if (response?.success) {
        toast.success("Menu deleted successfully");
        window.location.reload();
      } else {
        toast.error(response?.message || "Failed to delete menu");
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast.error("Failed to delete menu");
    }
  };

  const handleEdit = (menu: any) => {
    setSelectedMenu(menu);
    setShowUpdateModal(true);
  };

  const handleSuccess = () => {
    setShowUpdateModal(false);
    setSelectedMenu(null);
    toast.success("Menu updated successfully");
    router.refresh()
  };

  return (
    <>
      {/* <div className="mb-6 flex w-full items-center justify-between gap-4">
        <div className="w-full">
          <Link href="/dashboard/restaurant/menu/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create New Menu
            </Button>
          </Link>
        </div>
      </div> */}

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Name</TableHead>
              <TableHead>Total categories</TableHead>
              <TableHead>Total items</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow key={data.id}>
              <TableCell className="font-medium">{data.name}</TableCell>
              <TableCell>{data.total_categories}</TableCell>
              <TableCell>{data.total_items}</TableCell>
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
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => handleEdit(data)}
                    >
                      Edit Menu
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setConfirmDelete({ id: data.id, name: data.name })}
                      className="cursor-pointer text-red-600"
                    >
                      Delete Menu
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

    
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white p-6 rounded shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
              <p className="mb-4">Are you sure you want to delete "{confirmDelete.name}"?</p>
              <p className="mb-4 text-sm text-red-600">This action cannot be undone.</p>
              <div className="flex justify-end space-x-2">  
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(confirmDelete.id)}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Update Menu Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Update Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedMenu(null);
                  }}
                >
                  ×
                </Button>
              </div>
              
              <MenuForm
                item={selectedMenu}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}