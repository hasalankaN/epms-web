"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { ProductList } from "@/components/admin-panel/product-management/ProductList";
import { ArchivedItems } from "@/components/admin-panel/product-management/ArchivedItems";
import { Orders } from "@/components/admin-panel/product-management/Orders";
import { ProductCategories } from "@/components/admin-panel/product-management/ProductCategories";
import { AddProductPanel } from "@/components/admin-panel/product-management/modals/AddProductPanel";
import { AddOrderPanel } from "@/components/admin-panel/product-management/modals/AddOrderPanel";
import { AddProductCategoryModal } from "@/components/admin-panel/product-management/modals/AddProductCategoryModal";
import { ViewCategoryProductsModal } from "@/components/admin-panel/product-management/modals/ViewCategoryProductsModal";
import type { ProductCategoryDataType } from "@/components/admin-panel/product-management/views/Categories/ProductCategoryTable";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";

export type ProductTabType = "product-list" | "archived-items" | "orders" | "categories";

const tabs = [
  { value: "orders", label: "Orders", mobileLabel: "Orders" },
  { value: "product-list", label: "Product List", mobileLabel: "Products" },
  { value: "archived-items", label: "Archived Items", mobileLabel: "Archive" },
  { value: "categories", label: "Categories", mobileLabel: "Categories" },
] as const;

import { useGetOrderSummary } from "@/hooks/api/orders/useGetOrderSummary";

export default function ProductManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: orderSummary } = useGetOrderSummary();

  const currentTab = searchParams.get("tab") as ProductTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "orders";

  // ===== PANEL / MODAL STATE =====
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [isAddOrderPanelOpen, setIsAddOrderPanelOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [renameCategory, setRenameCategory] = useState<ProductCategoryDataType | null>(null);
  
  const [isViewProductsModalOpen, setIsViewProductsModalOpen] = useState(false);
  const [viewProductsCategory, setViewProductsCategory] = useState<ProductCategoryDataType | null>(null);

  // ===== HANDLERS =====
  const handleTabChange = (tabValue: ProductTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleRenameCategory = (category: ProductCategoryDataType) => {
    setRenameCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setRenameCategory(null);
  };

  const handleViewProducts = (category: ProductCategoryDataType) => {
    setViewProductsCategory(category);
    setIsViewProductsModalOpen(true);
  };

  return (
    <div className="space-y-3 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-nowrap">
        {/* Tabs */}
        <div className="flex-1 overflow-hidden">
          <HorizontalScrollContainer>
            <div className={TAB_STYLES.container}>
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    TAB_STYLES.triggerBase,
                    "w-auto px-4 flex items-center justify-center gap-2",
                    activeTab === tab.value
                      ? TAB_STYLES.active
                      : TAB_STYLES.inactive
                  )}
                >
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.mobileLabel}</span>
                  {tab.value === "orders" && (
                    <span 
                      className={cn(
                        "flex items-center justify-center shrink-0",
                        "w-5 h-5 px-1",
                        "rounded-full text-white text-center",
                        "font-['Roboto'] text-[11px] font-medium leading-[16px] tracking-[0.5px]",
                        activeTab === tab.value ? "bg-[#314158]" : "bg-[#90A1B9]" 
                      )}
                    >
                      {orderSummary?.all ?? 0}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </HorizontalScrollContainer>
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

        {/* Add Order Button (Orders Tab) */}
        {activeTab === "orders" && (
          <button
            onClick={() => setIsAddOrderPanelOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add Order</span>
          </button>
        )}

        {/* Add New Category Button */}
        {activeTab === "categories" && (
          <button
            onClick={() => {
              setRenameCategory(null);
              setIsCategoryModalOpen(true);
            }}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add New Category</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "product-list" && <ProductList />}
      {activeTab === "archived-items" && <ArchivedItems />}
      {activeTab === "orders" && <Orders />}
      {activeTab === "categories" && (
        <ProductCategories 
          onRename={handleRenameCategory} 
          onViewProducts={handleViewProducts} 
        />
      )}

      {/* Add Product Panel */}
      <AddProductPanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
      />

      {/* Add Order Panel */}
      <AddOrderPanel
        isOpen={isAddOrderPanelOpen}
        onClose={() => setIsAddOrderPanelOpen(false)}
      />

      {/* Add / Rename Category Modal */}
      <AddProductCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        category={renameCategory}
      />

      {/* View Category Products Modal */}
      <ViewCategoryProductsModal
        isOpen={isViewProductsModalOpen}
        onClose={() => setIsViewProductsModalOpen(false)}
        category={viewProductsCategory}
      />
    </div>
  );
}
