import { getAllMenu } from "@/actions/menu/api";
import MenuTable from "@/components/restaurant/menu/MenuTable";
import Pagination from "@/components/dashboard/restaurant/Pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MenuPageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function Menu({ searchParams }: MenuPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "10", 10);

  let data: any | null = null;
  let error: string | null = null;

  try {
    data = await getAllMenu(page, limit);

  } catch (err: any) {
    console.error("Error fetching menu data:", err);
    error = "Failed to load menu. Please try again later.";
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }


  const hasMenu = data?.data && typeof data.data === 'object' && data.data.id;

  if (!hasMenu) {
    return (
      <div className="container mx-auto py-5">
        <h1 className="mb-4 text-2xl font-bold">Menu</h1>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-4">No menu found.</p>
          <Link href="/dashboard/restaurant/menu/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Menu</h1>
      <MenuTable data={data.data} />
    </div>
  );
}