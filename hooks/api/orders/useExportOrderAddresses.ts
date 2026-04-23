import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { generateBaseCSV } from "@/utils/export/generate-base-csv";

interface ExportAddressesPayload {
  order_ids: string[];
}

interface AddressData {
  order_id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postal_code: string;
}

interface ExportAddressesResponse {
  status: string;
  message: string | null;
  data: AddressData[];
}

/**
 * Hook to export delivery addresses for selected orders.
 */
export function useExportOrderAddresses() {
  return useMutation({
    mutationFn: async (payload: ExportAddressesPayload) => {
      const response = await api.patch<ExportAddressesResponse>(
        API_ENDPOINTS.orders.EXPORT_ADDRESSES,
        payload
      );
      
      return response.data;
    },
    onMutate: () => {
      toast.loading("Preparing address export...", { id: "export-addresses" });
    },
    onSuccess: (data) => {
      if (data.status === "SUCCESS" && data.data.length > 0) {
        toast.success(`Exported ${data.data.length} addresses.`, { id: "export-addresses" });
        
        // Generate CSV
        const rows = data.data.map((item) => [
          item.order_number || item.order_id,
          item.customer_name || "-",
          item.phone || "-",
          item.address || "-",
          item.city || "-",
          item.district || "-",
          item.postal_code || "-",
        ]);

        generateBaseCSV({
          fileNamePrefix: "Order_Addresses_Report",
          headers: [
            "Order ID",
            "Customer Name",
            "Phone",
            "Address",
            "City",
            "District",
            "Postal Code",
          ],
          rows,
        });
      } else if (data.data.length === 0) {
        toast.error("No addresses found for selected orders.", { id: "export-addresses" });
      } else {
        toast.error(data.message || "Failed to export addresses.", { id: "export-addresses" });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred while exporting addresses.", { id: "export-addresses" });
    },
  });
}
