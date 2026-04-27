import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
}

function escapeCSVField(field: string | number | boolean | null | undefined): string {
  if (field === null || field === undefined) return "";
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatLineItems(lineItems: InvoiceLineItem[] | null): string {
  if (!lineItems || !Array.isArray(lineItems)) return "";
  return lineItems
    .map((item) => `${item.description} (Qty: ${item.quantity}, Unit: ${item.unitPrice}, Total: ${item.lineTotal})`)
    .join(" | ");
}

async function exportInvoicesToCSV() {
  console.log("Fetching invoices from Supabase...");

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*, proposals(company_name, client_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    process.exit(1);
  }

  if (!invoices || invoices.length === 0) {
    console.log("No invoices found.");
    process.exit(0);
  }

  console.log(`Found ${invoices.length} invoices. Converting to CSV...`);

  const headers = [
    "Invoice Number",
    "Order ID",
    "Status",
    "Client Name",
    "Client Company",
    "Client Address",
    "Client TRN",
    "Issue Date",
    "Due Date",
    "Currency",
    "Subtotal",
    "Discount Type",
    "Discount Value",
    "Discount Amount",
    "Apply VAT",
    "VAT Amount",
    "Total Amount",
    "Line Items",
    "Notes",
    "Payment Date",
    "Payment Method",
    "Payment Reference",
    "Is Recurring",
    "Recurring Interval",
    "Issuer Name",
    "Issuer Address",
    "Issuer Phone",
    "Issuer TRN",
    "Bank Account Holder",
    "IBAN",
    "Swift Code",
    "Bank Address",
    "Created At",
    "Updated At",
    "Proposal Company",
    "Proposal Client"
  ];

  const csvRows = [headers.join(",")];

  for (const invoice of invoices) {
    const proposal = invoice.proposals as { company_name?: string; client_name?: string } | null;

    const row = [
      escapeCSVField(invoice.invoice_number),
      escapeCSVField(invoice.order_id),
      escapeCSVField(invoice.status),
      escapeCSVField(invoice.client_name),
      escapeCSVField(invoice.client_company),
      escapeCSVField(invoice.client_address),
      escapeCSVField(invoice.client_trn),
      escapeCSVField(invoice.issue_date),
      escapeCSVField(invoice.due_date),
      escapeCSVField(invoice.currency),
      escapeCSVField(invoice.subtotal),
      escapeCSVField(invoice.discount_type),
      escapeCSVField(invoice.discount_value),
      escapeCSVField(invoice.discount_amount),
      escapeCSVField(invoice.apply_vat),
      escapeCSVField(invoice.vat_amount),
      escapeCSVField(invoice.total_amount),
      escapeCSVField(formatLineItems(invoice.line_items as InvoiceLineItem[])),
      escapeCSVField(invoice.notes),
      escapeCSVField(invoice.payment_date),
      escapeCSVField(invoice.payment_method),
      escapeCSVField(invoice.payment_reference),
      escapeCSVField(invoice.is_recurring),
      escapeCSVField(invoice.recurring_interval),
      escapeCSVField(invoice.issuer_name),
      escapeCSVField(invoice.issuer_address),
      escapeCSVField(invoice.issuer_phone),
      escapeCSVField(invoice.issuer_trn),
      escapeCSVField(invoice.bank_account_holder),
      escapeCSVField(invoice.iban),
      escapeCSVField(invoice.swift_code),
      escapeCSVField(invoice.bank_address),
      escapeCSVField(invoice.created_at),
      escapeCSVField(invoice.updated_at),
      escapeCSVField(proposal?.company_name),
      escapeCSVField(proposal?.client_name)
    ];

    csvRows.push(row.join(","));
  }

  const csvContent = csvRows.join("\n");
  const outputPath = path.join(process.cwd(), "invoices-export.csv");

  fs.writeFileSync(outputPath, csvContent, "utf-8");

  console.log(`Successfully exported ${invoices.length} invoices to: ${outputPath}`);
}

exportInvoicesToCSV().catch(console.error);
