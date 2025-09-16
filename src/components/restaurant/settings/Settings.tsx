"use client";

import { useState, useEffect,useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { 
  updateBasicInfo, 
  uploadLogoImage,
  addContactInfo,
  getAllContactInfo,
  updateContactInfo,
  deleteContactInfo,
  setPrimaryContact,
  createBankAccount,
  getAllBankAccounts,
  updateBankAccount,
  deleteBankAccount,
  setDefaultBankAccount,
  getChargeSettings,
  createOrUpdateChargeSettings,
  deleteChargeSettings,
  BankName,
  getBasicInfoSettings,
} from "@/actions/restaurant-settings/api";
import { Button } from "@/components/ui/button";
import Language from "./Language";

interface Restaurant {
  id: string;
  restaurant_name: string;
  primary_color?: string;
  language?: string;
  rtl_enabled?: boolean;
  font_family?: string;
  sms_enabled?: boolean;
}

interface Branch {
  id: string;
  name: string;
}

interface ContactInfo {
  id: string;
  module_type: "restaurant" | "branch";
  module_id: string;
  type: string;
  value: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

interface BankAccount {
  id: string;
  bank_name: BankName;
  account_number: string;
  account_name: string;
  is_default: boolean;
  is_active: boolean;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

interface ChargeSettings {
  service_charge_fee: number;
  package_charge_fee: number;
  delivery_fee_type: "fixed" | "dynamic";
  delivery_fee_fixed?: number;
  delivery_fee_dynamic?: {
    starting_fee: number;
    price_per_meter: number;
    minimum_fee: number;
  };
  dine_in_fee_type: "fixed" | "dynamic";
  dine_in_fee_fixed?: number;
  dine_in_fee_dynamic?: {
    price_per_guest: number;
    price_per_hour: number;
    minimum_fee: number;
  };
}

const BANK_NAMES = [
  "Commercial Bank of Ethiopia",
  "Awash International Bank",
  "Dashen Bank",
  "Bank of Abyssinia",
  "Cooperative Bank of Oromia",
  "Berhan International Bank",
  "Nib International Bank",
  "Hibret Bank",
  "Bunna International Bank",
  "Wegagen Bank",
  "Abay Bank",
  "Zemen Bank",
  "Oromia International Bank",
  "Enat Bank",
  "Hijra Bank",
  "Siinqee Bank",
  "Ahadu Bank",
  "Tsehay Bank"
] as const;

export default function Settings({ restaurant, branches }: { restaurant: any; branches: Branch[] }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [chargeSettings, setChargeSettings] = useState<ChargeSettings | null>(null);
  const [hasChargeSettings, setHasChargeSettings] = useState(false);
const logoRef = useRef<HTMLInputElement>(null);
const restaurantImageRef = useRef<HTMLInputElement>(null);
const [logoFile, setLogoFile] = useState<File | null>(null);
const [restaurantImageFile, setRestaurantImageFile] = useState<File | null>(null);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [editingBankAccount, setEditingBankAccount] = useState<BankAccount | null>(null);
  const router = useRouter();
  const [basicInfo, setBasicInfo] = useState<any>({});

  type ModuleType = "restaurant" | "branch";

  const [newContact, setNewContact] = useState<{
    module_type: ModuleType;
    module_id: string;
    type: string;
    value: string;
    is_primary: boolean;
  }>({
    module_type: "restaurant",
    module_id: restaurant.id,
    type: "phone",
    value: "",
    is_primary: false,
  });


  const [newBankAccount, setNewBankAccount] = useState({
    bank_name: "Commercial Bank of Ethiopia" as BankName,
    account_number: "",
    account_name: "",
    is_default: false,
    is_active: true,
    branch_id: ""
  });

  
  const [chargeForm, setChargeForm] = useState<ChargeSettings>({
    service_charge_fee: 0,
    package_charge_fee: 0,
    delivery_fee_type: "fixed",
    delivery_fee_fixed: 0,
    delivery_fee_dynamic: {
      starting_fee: 0,
      price_per_meter: 0,
      minimum_fee: 0
    },
    dine_in_fee_type: "fixed",
    dine_in_fee_fixed: 0,
    dine_in_fee_dynamic: {
      price_per_guest: 0,
      price_per_hour: 0,
      minimum_fee: 0
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [basicInfo,contactRes, bankRes, chargeRes] = await Promise.all([
        getBasicInfoSettings(),
        getAllContactInfo({ module_type: "restaurant" }),
        getAllBankAccounts(),
        getChargeSettings()
      ]);

      console.log(basicInfo,'Basic info res from load data')

   setBasicInfo({
        restaurant_name: basicInfo.data.restaurant_name || restaurant.restaurant_name,
        primary_color: basicInfo.data.primary_color || "#000000",
        sms_enabled: basicInfo?.data?.SystemSetting?.sms_enabled ,
      });

      setContactInfo(contactRes?.data?.data || []);
      setBankAccounts(bankRes?.data?.rows || []);
        console.log(chargeRes,'charge res from load data')
      if (chargeRes.data) {
        setChargeSettings(chargeRes.data);
        setChargeForm(chargeRes.data);
        setHasChargeSettings(true);
      } else {
        setHasChargeSettings(false);
        setChargeForm({
          service_charge_fee: 0,
          package_charge_fee: 0,
          delivery_fee_type: "fixed",
          delivery_fee_fixed: 0,
          delivery_fee_dynamic: {
            starting_fee: 0,
            price_per_meter: 0,
            minimum_fee: 0
          },
          dine_in_fee_type: "fixed",
          dine_in_fee_fixed: 0,
          dine_in_fee_dynamic: {
            price_per_guest: 0,
            price_per_hour: 0,
            minimum_fee: 0
          }
        });
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateBasicInfo(restaurant.id, basicInfo);
      router.refresh();
      toast.success("Basic information updated successfully");
    } catch (error) {
      toast.error("Failed to update basic information");
    } finally {
      setLoading(false);
    }
  };

const handleUploadImages = async () => {
  if (!logoFile && !restaurantImageFile) {
    toast.error("Please select at least one image to upload");
    return;
  }

  try {
    setLoading(true);
    const formData = new FormData();
    
    if (logoFile) {
      formData.append("logo", logoFile);
    }
    if (restaurantImageFile) {
      formData.append("images", restaurantImageFile);
    }

    await uploadLogoImage(formData);
    toast.success("Images uploaded successfully");
    
   
    setLogoFile(null);
    setRestaurantImageFile(null);
    if (logoRef.current) logoRef.current.value = "";
    if (restaurantImageRef.current) restaurantImageRef.current.value = "";
    
  } catch (error) {
    toast.error("Failed to upload images");
  } finally {
    setLoading(false);
  }
};
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addContactInfo(newContact);
      toast.success("Contact information added successfully");
      setNewContact({ 
        ...newContact, 
        value: "", 
        is_primary: false,
        module_type: "restaurant",
        module_id: restaurant.id
      });
      await loadData();
    } catch (error) {
      toast.error("Failed to add contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleEditContact = (contact: ContactInfo) => {
    setEditingContact(contact);
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;

    try {
      setLoading(true);
      await updateContactInfo(editingContact.id, {
        type: editingContact.type,
        value: editingContact.value,
        is_primary: editingContact.is_primary
      });
      toast.success("Contact information updated successfully");
      setEditingContact(null);
      await loadData();
    } catch (error) {
      toast.error("Failed to update contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEditContact = () => {
    setEditingContact(null);
  };

  const handleSetPrimaryContact = async (id: string) => {
    try {
      setLoading(true);
      await setPrimaryContact(id);
      toast.success("Primary contact set successfully");
      await loadData();
    } catch (error) {
      toast.error("Failed to set primary contact");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      setLoading(true);
      await deleteContactInfo(id);
      toast.success("Contact deleted successfully");
      await loadData();
    } catch (error) {
      toast.error("Failed to delete contact");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createBankAccount(newBankAccount);
      toast.success("Bank account added successfully");
      setNewBankAccount({
        bank_name: "Commercial Bank of Ethiopia",
        account_number: "",
        account_name: "",
        is_default: false,
        is_active: true,
        branch_id: ""
      });
      await loadData();
    } catch (error) {
      toast.error("Failed to add bank account");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBankAccount = (account: BankAccount) => {
    setEditingBankAccount(account);
  };

  const handleUpdateBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBankAccount) return;

    try {
      setLoading(true);
      await updateBankAccount(editingBankAccount.id, {
        bank_name: editingBankAccount.bank_name,
        account_number: editingBankAccount.account_number,
        account_name: editingBankAccount.account_name,
        is_default: editingBankAccount.is_default,
        is_active: editingBankAccount.is_active,
        branch_id: editingBankAccount.branch_id
      });
      toast.success("Bank account updated successfully");
      setEditingBankAccount(null);
      await loadData();
    } catch (error) {
      toast.error("Failed to update bank account");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEditBankAccount = () => {
    setEditingBankAccount(null);
  };

  const handleSetDefaultBank = async (id: string) => {
    try {
      setLoading(true);
      await setDefaultBankAccount(id);
      toast.success("Default bank account set successfully");
      await loadData();
    } catch (error) {
      toast.error("Failed to set default bank account");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBank = async (id: string) => {
    try {
      setLoading(true);
      await deleteBankAccount(id);
      toast.success("Bank account deleted successfully");
      await loadData();
    } catch (error) {
      toast.error("Failed to delete bank account");
    } finally {
      setLoading(false);
    }
  };

  const handleChargeSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createOrUpdateChargeSettings(chargeForm);
      toast.success("Charge settings updated successfully");
      await loadData();
    } catch (error) {
      toast.error("Failed to update charge settings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChargeSettings = async () => {
    try {
      setLoading(true);
      await deleteChargeSettings();
      toast.success("Charge settings deleted successfully");
      await loadData();
    } catch (error) {
      toast.error("Failed to delete charge settings");
    } finally {
      setLoading(false);
    }
  };

  const handleModuleTypeChange = (moduleType: "restaurant" | "branch") => {
    setNewContact({
      ...newContact,
      module_type: moduleType,
      module_id: moduleType === "restaurant" ? restaurant.id : branches[0]?.id || ""
    });
  };

  const handleModuleIdChange = (moduleId: string) => {
    setNewContact({
      ...newContact,
      module_id: moduleId
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex w-full h-full items-center justify-center "> Processing ...</div>
      </div>
    );
  }

  console.log(basicInfo,'basic info state value')
  return (
    <div className="container mx-auto p-4">

      <div className="flex border-b mb-6">
        {["basic", "contact", "bank", "charges","system"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "basic" && "Basic Info"}
            {tab === "contact" && "Contact Info"}
            {tab === "bank" && "Bank Accounts"}
            {tab === "charges" && "Charge Settings"}
            {tab === "system" && "System Settings"}

          </button>
        ))}
      </div>
   {activeTab === "system" && (

    <div>
      <Language/>
      </div>
   )}
      {activeTab === "basic" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Restaurant Name</label>
                <input
                  type="text"
                  value={basicInfo?.restaurant_name || ""}
                  onChange={(e) => setBasicInfo({ ...basicInfo, restaurant_name: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={basicInfo?.sms_enabled} 
                onChange={(e) => setBasicInfo({ ...basicInfo, sms_enabled: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm font-medium">SMS Enabled</label>
            </div>
            

              
              <Button
                type="submit"
                disabled={loading}
            
              >
                Update Basic Info
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Logo & Images</h2>
         <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Upload Logo</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              ref={logoRef}
                              className="hidden"
                              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                            />
                            <button
                              type="button"
                              onClick={() => logoRef.current?.click()}
                              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              Choose Logo
                            </button>
                            {logoFile && (
                              <span className="text-sm text-gray-600">
                                {logoFile.name}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Upload Restaurant Image</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              ref={restaurantImageRef}
                              className="hidden"
                              onChange={(e) => setRestaurantImageFile(e.target.files?.[0] || null)}
                            />
                            <button
                              type="button"
                              onClick={() => restaurantImageRef.current?.click()}
                              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              Choose Restaurant Image
                            </button>
                            {restaurantImageFile && (
                              <span className="text-sm text-gray-600">
                                {restaurantImageFile.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={handleUploadImages}
                          disabled={!logoFile && !restaurantImageFile}
                          // className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Upload Selected Images
                        </Button>
                      </div>
          </div>
        </div>
      )}

 
      {activeTab === "contact" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          
       
          <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Module Type</label>
              <select
                value={newContact.module_type}
                onChange={(e) => handleModuleTypeChange(e.target.value as "restaurant" | "branch")}
                className="w-full p-2 border rounded-md"
              >
                <option value="restaurant">Restaurant</option>
                <option value="branch">Branch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {newContact.module_type === "restaurant" ? "Restaurant" : "Branch"}
              </label>
              <select
                value={newContact.module_id}
                onChange={(e) => handleModuleIdChange(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={newContact.module_type === "restaurant"}
              >
                {newContact.module_type === "restaurant" ? (
                  <option value={restaurant.id}>{restaurant.restaurant_name}</option>
                ) : (
                  branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Contact Type</label>
              <select
                value={newContact.type}
                onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="fax">Fax</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            
            <div className="flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={newContact.is_primary}
                  onChange={(e) => setNewContact({ ...newContact, is_primary: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm font-medium">Primary</label>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-2">Value</label>
              <input
                type="text"
                value={newContact.value}
                onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
                placeholder="Enter contact information"
              />
            </div>
            
            <div className="flex items-end">
              <Button
                type="submit"
                
              >
                Add Contact
              </Button>
            </div>
          </form>

         
          <div className=" rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contactInfo.map((contact) => {
                  const moduleName = contact.module_type === "restaurant" 
                    ? restaurant.restaurant_name 
                    : branches.find(b => b.id === contact.module_id)?.name || "Unknown Branch";
                  
                  return (
                    <tr key={contact.id}>
                      <td className="px-6 py-4">
                        <span className="capitalize">{contact.module_type}: </span>
                        {moduleName}
                      </td>
                      <td className="px-6 py-4 capitalize">{contact.type}</td>
                      <td className="px-6 py-4">{contact.value}</td>
                      <td className="px-6 py-4">
                        {contact.is_primary ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Primary</span>
                        ) : (
                          <Button
                            onClick={() => handleSetPrimaryContact(contact.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Set Primary
                          </Button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditContact(contact)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

       
          {editingContact && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Edit Contact</h3>
                <form onSubmit={handleUpdateContact}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Type</label>
                      <select
                        value={editingContact.type}
                        onChange={(e) => setEditingContact({ ...editingContact, type: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="fax">Fax</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Value</label>
                      <input
                        type="text"
                        value={editingContact.value}
                        onChange={(e) => setEditingContact({ ...editingContact, value: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingContact.is_primary}
                        onChange={(e) => setEditingContact({ ...editingContact, is_primary: e.target.checked })}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">Primary</label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={handleCancelEditContact}
                      className="px-4 py-2 border border-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

   
      {activeTab === "bank" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Bank Accounts</h2>
          
         
          <form onSubmit={handleAddBankAccount} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Bank Name</label>
              <select
                value={newBankAccount.bank_name}
                onChange={(e) => setNewBankAccount({ ...newBankAccount, bank_name: e.target.value as BankName })}
                className="w-full p-2 border rounded-md"
              >
                {BANK_NAMES.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <input
                type="text"
                value={newBankAccount.account_number}
                onChange={(e) => setNewBankAccount({ ...newBankAccount, account_number: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Account Name</label>
              <input
                type="text"
                value={newBankAccount.account_name}
                onChange={(e) => setNewBankAccount({ ...newBankAccount, account_name: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Branch</label>
              <select
                value={newBankAccount.branch_id}
                onChange={(e) => setNewBankAccount({ ...newBankAccount, branch_id: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newBankAccount.is_default}
                onChange={(e) => setNewBankAccount({ ...newBankAccount, is_default: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm font-medium">Default Account</label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newBankAccount.is_active}
                onChange={(e) => setNewBankAccount({ ...newBankAccount, is_active: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm font-medium">Active</label>
            </div>
            
            <div className="md:col-span-3">
              <Button
                type="submit"
                
              >
                Add Bank Account
              </Button>
            </div>
          </form>

       
          <div className=" rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bankAccounts.map((account) => {
                  const branchName = branches.find(b => b.id === account.branch_id)?.name || "Main";
                  
                  return (
                    <tr key={account.id}>
                      <td className="px-6 py-4">{account.bank_name}</td>
                      <td className="px-6 py-4">{account.account_number}</td>
                      <td className="px-6 py-4">{account.account_name}</td>
                      <td className="px-6 py-4">{branchName}</td>
                      <td className="px-6 py-4">
                        {account.is_default ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Default</span>
                        ) : (
                          <Button
                            onClick={() => handleSetDefaultBank(account.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Set Default
                          </Button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditBankAccount(account)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteBank(account.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

   
          {editingBankAccount && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Edit Bank Account</h3>
                <form onSubmit={handleUpdateBankAccount}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Bank Name</label>
                      <select
                        value={editingBankAccount.bank_name}
                        onChange={(e) => setEditingBankAccount({ ...editingBankAccount, bank_name: e.target.value as BankName })}
                        className="w-full p-2 border rounded-md"
                      >
                        {BANK_NAMES.map((bank) => (
                          <option key={bank} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Number</label>
                      <input
                        type="text"
                        value={editingBankAccount.account_number}
                        onChange={(e) => setEditingBankAccount({ ...editingBankAccount, account_number: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Name</label>
                      <input
                        type="text"
                        value={editingBankAccount.account_name}
                        onChange={(e) => setEditingBankAccount({ ...editingBankAccount, account_name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Branch</label>
                      <select
                        value={editingBankAccount.branch_id || ""}
                        onChange={(e) => setEditingBankAccount({ ...editingBankAccount, branch_id: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingBankAccount.is_default}
                        onChange={(e) => setEditingBankAccount({ ...editingBankAccount, is_default: e.target.checked })}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">Default Account</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingBankAccount.is_active}
                        onChange={(e) => setEditingBankAccount({ ...editingBankAccount, is_active: e.target.checked })}
                        className="rounded"
                      />
                      <label className="text-sm font-medium">Active</label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={handleCancelEditBankAccount}
                      className="px-4 py-2 border border-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Update
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

     
      {activeTab === "charges" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Charge Settings</h2>
          
          <div className="mb-4 flex justify-between items-center">
            <div>
              {hasChargeSettings ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Settings Exist
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  No Settings Found
                </span>
              )}
            </div>
            {hasChargeSettings && (
              <Button
                onClick={handleDeleteChargeSettings}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete Settings
              </Button>
            )}
          </div>
          
          <form onSubmit={handleChargeSettingsSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Charge Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={chargeForm.service_charge_fee}
                  onChange={(e) => setChargeForm({ ...chargeForm, service_charge_fee: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Package Charge Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={chargeForm.package_charge_fee}
                  onChange={(e) => setChargeForm({ ...chargeForm, package_charge_fee: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Delivery Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Fee Type</label>
                  <select
                    value={chargeForm.delivery_fee_type}
                    onChange={(e) => setChargeForm({ 
                      ...chargeForm, 
                      delivery_fee_type: e.target.value as "fixed" | "dynamic" 
                    })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="dynamic">Dynamic</option>
                  </select>
                </div>
                
                {chargeForm.delivery_fee_type === "fixed" ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">Fixed Delivery Fee</label>
                    <input
                      type="number"
                      step="0.1"
                      value={chargeForm.delivery_fee_fixed || 0}
                      onChange={(e) => setChargeForm({ ...chargeForm, delivery_fee_fixed: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                ) : (
                  <div className="col-span-2 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Starting Fee</label>
                      <input
                        type="number"
                        step="0.1"
                        value={chargeForm.delivery_fee_dynamic?.starting_fee || 0}
                        onChange={(e) => setChargeForm({ 
                          ...chargeForm, 
                          delivery_fee_dynamic: { 
                            ...chargeForm.delivery_fee_dynamic!, 
                            starting_fee: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price per Meter</label>
                      <input
                        type="number"
                        step="0.1"
                        value={chargeForm.delivery_fee_dynamic?.price_per_meter || 0}
                        onChange={(e) => setChargeForm({ 
                          ...chargeForm, 
                          delivery_fee_dynamic: { 
                            ...chargeForm.delivery_fee_dynamic!, 
                            price_per_meter: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Minimum Fee</label>
                      <input
                        type="number"
                        step="0.1"
                        value={chargeForm.delivery_fee_dynamic?.minimum_fee || 0}
                        onChange={(e) => setChargeForm({ 
                          ...chargeForm, 
                          delivery_fee_dynamic: { 
                            ...chargeForm.delivery_fee_dynamic!, 
                            minimum_fee: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

           
            <div>
              <h3 className="text-lg font-medium mb-3">Dine-in Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dine-in Fee Type</label>
                  <select
                    value={chargeForm.dine_in_fee_type}
                    onChange={(e) => setChargeForm({ 
                      ...chargeForm, 
                      dine_in_fee_type: e.target.value as "fixed" | "dynamic" 
                    })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="dynamic">Dynamic</option>
                  </select>
                </div>
                
                {chargeForm.dine_in_fee_type === "fixed" ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">Fixed Dine-in Fee</label>
                    <input
                      type="number"
                      step="0.1"
                      value={chargeForm.dine_in_fee_fixed || 0}
                      onChange={(e) => setChargeForm({ ...chargeForm, dine_in_fee_fixed: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                ) : (
                  <div className="col-span-2 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price per Guest</label>
                      <input
                        type="number"
                        step="0.1"
                        value={chargeForm.dine_in_fee_dynamic?.price_per_guest || 0}
                        onChange={(e) => setChargeForm({ 
                          ...chargeForm, 
                          dine_in_fee_dynamic: { 
                            ...chargeForm.dine_in_fee_dynamic!, 
                            price_per_guest: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price per Hour</label>
                      <input
                        type="number"
                        step="0.1"
                        value={chargeForm.dine_in_fee_dynamic?.price_per_hour || 0}
                        onChange={(e) => setChargeForm({ 
                          ...chargeForm, 
                          dine_in_fee_dynamic: { 
                            ...chargeForm.dine_in_fee_dynamic!, 
                            price_per_hour: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Minimum Fee</label>
                      <input
                        type="number"
                        step="0.1"
                        value={chargeForm.dine_in_fee_dynamic?.minimum_fee || 0}
                        onChange={(e) => setChargeForm({ 
                          ...chargeForm, 
                          dine_in_fee_dynamic: { 
                            ...chargeForm.dine_in_fee_dynamic!, 
                            minimum_fee: parseFloat(e.target.value) || 0 
                          } 
                        })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
           
            >
              {hasChargeSettings ? "Update Charge Settings" : "Create Charge Settings"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}