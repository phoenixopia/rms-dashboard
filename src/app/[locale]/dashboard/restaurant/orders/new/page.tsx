'use client';

import { getAllCategories } from "@/actions/category.ts/api";
import { getAllMenuItems } from "@/actions/menu-items/api";
import { createOrder, getAlltables, getAllBranches } from "@/actions/order/api"; // ADD getAllBranches
import MenuItem from "@/components/restaurant/orders/MenuItem";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewOrder() {
    const [categories, setCategories] = useState<any[]>([]);
    const [menu_items, setMenuItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [cart, setCart] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<string | number>("");
    const [orderType, setOrderType] = useState<string>("takeaway");
    const [tables, setTables] = useState([]);
    const [table_id, setTableId] = useState("");
    const [order_loading, setOrderLoading] = useState(false);
    
    // NEW STATE FOR BRANCHES
    const [branches, setBranches] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>("");

    useEffect(() => {
        const fetch_data = async () => {
            try {
                const result = await getAllCategories({});
                setCategories(Array.isArray(result.data.data) ? result.data.data : []);

                // NEW: Fetch branches
                const branchesResult = await getAllBranches();
                setBranches(Array.isArray(branchesResult.data?.data) ? branchesResult.data.data : []);

                // Fetch tables for the first branch if available
                if (branchesResult.data?.branches?.length > 0) {
                    const firstBranchId = branchesResult.data.data[0].id;
                    setSelectedBranch(firstBranchId);
                    const table_result = await getAlltables(firstBranchId);
                    setTables(Array.isArray(table_result.data.tables) ? table_result.data.tables : []);
                } else {
                    setTables([]);
                }

                const item_result = await getAllMenuItems();
                const itemsWithSelection = Array.isArray(item_result.data.items)
                    ? item_result.data.items.map((item: any) => ({ ...item, isSelected: false }))

                    : [];
                setMenuItems(itemsWithSelection);

                setIsLoading(false);
                setError(null);
            } catch (err) {
                setIsLoading(false);
                setError("Failed to fetch data. " + err);
            }
        };

        fetch_data();
    }, []);

    // NEW: Function to handle branch change
    const handleBranchChange = async (branchId: string) => {
        setSelectedBranch(branchId);
        setTableId(""); 
        setTables([]);// Reset table selection when branch changes
        setCategories([]);
        setMenuItems([]);
        setCart([]);
        
        try {
            const table_result = await getAlltables({branch_id:branchId});
            setTables(Array.isArray(table_result.data.tables) ? table_result.data.tables : []);
            console.log(table_result, "tables for branch ", branchId);
            const categoryResult = await getAllCategories({branch_id:branchId});
            setCategories(Array.isArray(categoryResult.data.data) ? categoryResult.data.data : []);
            console.log(categoryResult, "categories for branch ", branchId);
            
            const item_result = await getAllMenuItems(undefined, branchId);
            const itemsWithSelection = Array.isArray(item_result.data.items)
                ? item_result.data.items.map((item: any) => ({ ...item, isSelected: false }))

                : [];
            setMenuItems(itemsWithSelection);
        } catch (error) {
            toast.error("Failed to fetch tables for this branch");
            console.log(error+"------------------- is error here");
            setTables([]);
        }
    };

    useEffect(() => {
        const newTotal = cart.reduce((acc, currentItem) => {
            return acc + (parseFloat(currentItem.unit_price) || 0) * (currentItem.quantity || 1);
        }, 0);
        setTotal(newTotal);
    }, [cart]);

    const handleCategoryClick = async (id: any) => {
        setIsLoading(true)
        try {
            const item_result = await getAllMenuItems(id)
            const fetchedItems = Array.isArray(item_result.data.items) ? item_result.data.items : [];
            
            const itemsWithSelection = fetchedItems.map((item: any) => ({
                ...item,
                isSelected: cart.some((cartItem: any) => cartItem.id === item.id),
            }));

            setMenuItems(itemsWithSelection);
            setIsLoading(false);
            setError(null)
        } catch (error) {
            setError(true);
        }
    }

    const handleAddToCart = (item: any) => {
        setCart((prevCart) => {
            const existing = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existing) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });

        setMenuItems(prevItems =>
            prevItems.map(menuItem =>
                menuItem.id === item.id ? { ...menuItem, isSelected: true } : menuItem
            )
        );
    };

    const handleQuantityChange = (itemId: string, delta: number) => {
        setCart(prevCart =>
            prevCart.map(cartItem =>
                cartItem.id === itemId
                    ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + delta) }
                    : cartItem
            )
        );
    };

    const handleAddOrder = async () => {
        setOrderLoading(true)
        try {
            const items = cart.map(item => ({
                menu_item_id: item.id,
                quantity: item.quantity,
                price: parseFloat(item.unit_price) || 0
            }));
            
            // NEW: Prepare order data with branch_id if selected
            const orderData: any = { 
                items, 
                order_type: orderType, 
                total_price: total 
            };
            
            if (table_id !== "") {
                orderData.table_number = table_id;
            }
            
            if (selectedBranch !== "") {
                orderData.branch_id = selectedBranch;
            }

            const response = await createOrder(orderData);
            
            if (response.success) {
                toast.success("Order created successfully!");
                setCart([]);
                setMenuItems(prevItems => prevItems.map(item => ({ ...item, isSelected: false })));
            } else {
                toast.error("Failed to create order: " + response.message);
            }
        } catch (error) {
            toast.error("An error occurred while creating the order.");
        }
        finally{
            setOrderLoading(false)
        }
    };

    const handleRemoveFromCart = (itemId: string) => {
        setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== itemId));
        setMenuItems(prevItems =>
            prevItems.map(menuItem =>
                menuItem.id === itemId ? { ...menuItem, isSelected: false } : menuItem
            )
        );
    };

    if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }
    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="mx-auto w-[100%] max-w-7xl mt-12 flex overflow-x-auto">
            {/* Left: Categories & Menu Items */}
            <div className="w-[80%] pr-6">
                <div className="flex gap-4 mb-4">
                    {/* NEW: Branch Dropdown */}
                    <label className="block">
                        <span className="text-gray-700 text-xs font-semibold">Branch</span>
                        <select
                            className="mt-1 block w-40 text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            value={selectedBranch}
                            onChange={e => handleBranchChange(e.target.value)}
                        >
                            <option value="">Select Branch</option>
                            {branches?.map((branch: any) => (
                                <option className="text-xs" key={branch.id} value={branch.id}>
                                    {branch.name ?? branch.branch_name ?? ""}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Category Dropdown */}
                    <label className="block">
                        <span className="text-gray-700 text-xs font-semibold">Categories</span>
                        <select
                            className="mt-1 block w-40 text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            value={selectedCategory}
                            onChange={e => {
                                const value = e.target.value;
                                setSelectedCategory(value);
                                handleCategoryClick(value === "" ? undefined : value);
                            }}
                        >
                            <option value="" >All</option>
                            {categories?.map((category: any, index: number) => (
                                <option className="text-xs" key={index} value={category.id}>
                                    {category.name ?? ""}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Order Type Dropdown */}
                    <label className="block">
                        <span className="text-gray-700 text-xs font-semibold">Order Type</span>
                        <select
                            className="mt-1 text-xs block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            value={orderType}
                            onChange={e => setOrderType(e.target.value)}
                        >
                            <option value="takeaway">Takeaway</option>
                            <option value="dine-in">Dine-in</option>
                        </select>
                    </label>

                    {/* Table Dropdown - Only show for dine-in */}
                    {orderType === "dine-in" && (
                        <label className="block">
                            <span className="text-gray-700 font-semibold text-xs">Dining Table</span>
                            <select
                                className="mt-1 text-black text-xs block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                                value={table_id}
                                onChange={e => setTableId(e.target.value)}
                                disabled={!selectedBranch} // Disable if no branch selected
                            >
                                <option value="">Select Table</option>
                                {tables.map((table: any) => (
                                    <option className="text-black" key={table.id} value={table.id}>
                                        {table.table_number}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                </div>

                <div style={{ maxHeight: 'calc(5 * 40vw * 0.7 / 4)' }}>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-2 lg:gap-6">
                        {menu_items.map((item, idx) => (
                            <div key={idx} onClick={() => handleAddToCart(item)}>
                                <MenuItem
                                    image={item.image}
                                    idx={idx}
                                    item_name={item.name}
                                    item_price={item.unit_price}
                                    isSelected={item.isSelected}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Cart */}
            <div className="w-[20%] bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                <div className="flex items-center mb-4 fixed">
                    <h1 className="text-2xl mr-2"><ShoppingCart/></h1>
                    <span className="font-bold text-lg mr-2">Cart</span>
                    <span className="border-blue-500 bg-blue-700 hover:bg-blue-500 cursor-pointer text-white text-xs p-2 rounded-lg">
                        <button 
                            className={order_loading ? "disabled" : "cursor-pointer"}  
                            onClick={handleAddOrder}
                            disabled={order_loading || !selectedBranch} // Disable if no branch selected
                        >
                            {order_loading ? 'Loading...' : 'Order'}
                        </button>
                    </span>
                </div>
                <p className="mt-8">Total: {total.toFixed(2)} Birr</p>
                <div className="w-full flex flex-col gap-2">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center text-sm">Cart is empty</p>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={idx} className="border-b py-1 text-xs flex justify-between items-center">
                                <span>{item.name} - {item.unit_price} x {item.quantity}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleQuantityChange(item.id, -1)} className="px-2 bg-gray-300 rounded">-</button>
                                    <button onClick={() => handleQuantityChange(item.id, 1)} className="px-2 bg-gray-300 rounded">+</button>
                                    <button
                                        onClick={() => handleRemoveFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 font-bold ml-2 focus:outline-none"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}