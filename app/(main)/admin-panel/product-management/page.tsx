"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { ProductList } from "@/components/admin-panel/product-management/ProductList";
import { ArchivedItems } from "@/components/admin-panel/product-management/ArchivedItems";
import { Orders } from "@/components/admin-panel/product-management/Orders";
import { AddProductPanel } from "@/components/admin-panel/product-management/modals/AddProductPanel";

export type ProductTabType = "product-list" | "archived-items" | "orders";

const tabs = [
  { value: "product-list", label: "Product List", mobileLabel: "Products", icon: "package" },
  { value: "archived-items", label: "Archived Items", mobileLabel: "Archive", icon: "archive" },
  { value: "orders", label: "Orders", mobileLabel: "Orders", icon: "list-numbers" },
] as const;

export default function ProductManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as ProductTabType;
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "product-list";

  const handleTabChange = (tabValue: ProductTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-3 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-nowrap">
        {/* Tabs */}
        <div className={TAB_STYLES.container}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                TAB_STYLES.triggerBase,
                "w-auto px-4",
                activeTab === tab.value
                  ? TAB_STYLES.active
                  : TAB_STYLES.inactive
              )}
            >
              <span className={cn(tab.icon, "h-4 w-4")} />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </div>

        {/* Add Product Button */}
        {activeTab === "product-list" && (
          <button
            onClick={() => setIsAddPanelOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add New Product</span>
          </button>
        )}

        {/* Generate Report Button (Orders Tab) */}
        {activeTab === "orders" && (
          <button
            className={cn(
              BUTTON_STYLES.primary.responsive
            )}
          >
            <FileText className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Generate Report</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "product-list" && <ProductList />}
      {activeTab === "archived-items" && <ArchivedItems />}
      {activeTab === "orders" && <Orders />}

      {/* Add Product Panel */}
      <AddProductPanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
      />
    </div>
  );
}
