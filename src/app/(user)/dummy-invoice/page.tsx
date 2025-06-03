"use client";

import InvoiceForm from "@/components/form/InvoiceForm";
import type { InvoiceFormData } from "@/schemas/invoice";
import React from "react";

export default function InvoicePage() {
  const handleInvoiceSubmit = (data: InvoiceFormData) => {
    console.log("Invoice data submitted:", data);

    // Here you would typically:
    // 1. Send data to your API
    // 2. Generate PDF invoice
    // 3. Redirect to success page or show success message

    alert("請求書が正常に生成されました！");
  };

  return <InvoiceForm onSubmit={handleInvoiceSubmit} />;
}
