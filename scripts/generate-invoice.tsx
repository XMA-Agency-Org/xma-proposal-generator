import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, renderToFile } from "@react-pdf/renderer";
import path from "path";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
    color: "#1A1A1A",
    fontSize: 9,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  logoBox: { width: 220 },
  logoImg: { width: 180, height: 60, objectFit: "contain" },
  fromBlock: { marginTop: 12 },
  fromLine: { fontSize: 9, color: "#333333", marginBottom: 2 },
  fromCompany: { fontSize: 11, fontWeight: "bold", marginBottom: 4 },
  titleBlock: { alignItems: "flex-end" },
  invoiceTitle: { fontSize: 28, fontWeight: "bold", letterSpacing: 1, color: "#1A1A1A" },
  invoiceNumber: { fontSize: 10, marginTop: 4, color: "#1A1A1A" },
  balanceLabel: { fontSize: 9, marginTop: 18, color: "#555555" },
  balanceDue: { fontSize: 14, fontWeight: "bold", color: "#1A1A1A" },

  twoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 18,
  },
  billToBox: { width: "55%" },
  billToHeader: { fontSize: 9, color: "#666666", marginBottom: 4 },
  billToCompany: { fontSize: 10, fontWeight: "bold", color: "#1A1A1A", marginBottom: 4 },
  billToLine: { fontSize: 9, color: "#333333", marginBottom: 2 },

  metaBox: { width: "40%" },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metaLabel: { fontSize: 9, color: "#666666" },
  metaValue: { fontSize: 9, color: "#1A1A1A" },

  subjectBlock: { marginTop: 8, marginBottom: 16 },
  subjectLabel: { fontSize: 9, color: "#666666", marginBottom: 4 },
  subjectValue: { fontSize: 10, color: "#1A1A1A" },

  table: { marginTop: 8 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3A3A3A",
    color: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableHeaderCell: { fontSize: 9, fontWeight: "bold" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#DDDDDD",
    borderBottomStyle: "solid",
  },
  colNum: { width: "5%" },
  colDesc: { width: "55%", paddingRight: 8 },
  colQty: { width: "8%", textAlign: "right" },
  colRate: { width: "10%", textAlign: "right" },
  colTaxable: { width: "11%", textAlign: "right" },
  colAmount: { width: "11%", textAlign: "right" },

  descTitle: { fontSize: 9, fontWeight: "bold", color: "#1A1A1A", marginBottom: 2 },
  descBody: { fontSize: 8, color: "#444444", lineHeight: 1.4 },

  totalsBlock: {
    marginTop: 4,
    alignSelf: "flex-end",
    width: "45%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#DDDDDD",
  },
  totalLabel: { fontSize: 9, color: "#333333" },
  totalValue: { fontSize: 9, color: "#1A1A1A" },
  totalRowBold: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#F0F0F0",
  },
  totalLabelBold: { fontSize: 10, fontWeight: "bold", color: "#1A1A1A" },
  totalValueBold: { fontSize: 10, fontWeight: "bold", color: "#1A1A1A" },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#E8E8E8",
    marginTop: 1,
  },

  taxSection: { marginTop: 28 },
  taxTitle: { fontSize: 10, fontWeight: "bold", marginBottom: 8, color: "#1A1A1A" },
  taxNote: { fontSize: 8, color: "#666666", marginBottom: 8, fontStyle: "italic" },
  taxTable: { borderTopWidth: 0.5, borderTopColor: "#DDDDDD" },
  taxRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#DDDDDD",
  },
  taxColDetails: { width: "60%", fontSize: 9 },
  taxColAmount: { width: "20%", textAlign: "right", fontSize: 9 },
  taxColTax: { width: "20%", textAlign: "right", fontSize: 9 },
  taxRowBold: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#F0F0F0",
  },

  page2Section: { marginBottom: 18 },
  page2Header: { fontSize: 11, fontWeight: "bold", marginBottom: 6, color: "#1A1A1A" },
  page2Line: { fontSize: 9, color: "#333333", marginBottom: 3, lineHeight: 1.4 },

  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 40,
    fontSize: 8,
    color: "#999999",
  },
});

function Invoice() {
  return (
    <Document>
      {/* Page 1 */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoBox}>
            <Image style={styles.logoImg} src={path.join(process.cwd(), "public", "XMA-01.png")} />
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <Text style={styles.invoiceNumber}># XMA-2026-000048</Text>
            <Text style={styles.balanceLabel}>Balance Due</Text>
            <Text style={styles.balanceDue}>USD 3,000.00</Text>
          </View>
        </View>

        {/* From + meta + bill to */}
        <View style={styles.twoCol}>
          <View style={styles.billToBox}>
            <Text style={styles.fromCompany}>XLUXIVE DIGITAL MARKETING LLC</Text>
            <Text style={styles.fromLine}>Company ID : 1248664</Text>
            <Text style={styles.fromLine}>24, The Curve Building,</Text>
            <Text style={styles.fromLine}>Al Quoz, Industrial Area 3</Text>
            <Text style={styles.fromLine}>Dubai Dubai 00000</Text>
            <Text style={styles.fromLine}>United Arab Emirates</Text>
            <Text style={styles.fromLine}>TRN 104853792000003</Text>
            <Text style={styles.fromLine}>508107712</Text>
            <Text style={styles.fromLine}>amir@xmaagency.com</Text>
            <Text style={styles.fromLine}>https://www.xma.ae</Text>
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.billToBox}>
            <Text style={styles.billToHeader}>Bill To</Text>
            <Text style={styles.billToCompany}>Marketing & Advertising (DC Mena)</Text>
            <Text style={styles.billToLine}>Al-Sharafiyah District,</Text>
            <Text style={styles.billToLine}>Madinah Road</Text>
            <Text style={styles.billToLine}>Jeddah</Text>
            <Text style={styles.billToLine}>23218</Text>
            <Text style={styles.billToLine}>Saudi Arabia</Text>
          </View>
          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Invoice Date :</Text>
              <Text style={styles.metaValue}>13 May 2026</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Terms :</Text>
              <Text style={styles.metaValue}>Due on Signature</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Due Date :</Text>
              <Text style={styles.metaValue}>Upon Signature</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>P.O.# :</Text>
              <Text style={styles.metaValue}>XMA-2026-05-AUTOHUB-Q2</Text>
            </View>
          </View>
        </View>

        {/* Subject */}
        <View style={styles.subjectBlock}>
          <Text style={styles.subjectLabel}>Subject :</Text>
          <Text style={styles.subjectValue}>AutoHub KSA | Q2 AI vs Real Engagement Pilot — 50% Upfront Milestone</Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colNum]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Item & Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.colTaxable]}>Taxable{"\n"}Amount</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colNum}>1</Text>
            <View style={styles.colDesc}>
              <Text style={styles.descTitle}>Video Production Services</Text>
              <Text style={styles.descBody}>
                50% Upfront Milestone for the AutoHub KSA Q2 AI vs Real Engagement Pilot. Covers research, scripting, storyboards, asset audit, and AI generation rounds across: 3× AI vs Real Contest Videos, 1× 6Ms Quality Hero Video, 1× Car Care Technical Commercial, and the Quiz Microsite.
              </Text>
            </View>
            <Text style={styles.colQty}>1.00</Text>
            <Text style={styles.colRate}>3,000.00</Text>
            <Text style={styles.colTaxable}>3,000.00</Text>
            <Text style={styles.colAmount}>3,000.00</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sub Total</Text>
            <Text style={styles.totalValue}>3,000.00</Text>
          </View>
          <View style={styles.totalRowBold}>
            <Text style={styles.totalLabelBold}>Total</Text>
            <Text style={styles.totalValueBold}>USD 3,000.00</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.totalLabelBold}>Balance Due</Text>
            <Text style={styles.totalValueBold}>USD 3,000.00</Text>
          </View>
        </View>

        {/* Tax Summary */}
        <View style={styles.taxSection}>
          <Text style={styles.taxTitle}>Tax Summary</Text>
          <Text style={styles.taxNote}>
            Out of scope: cross-border B2B export of services from UAE to KSA — not subject to UAE VAT.
          </Text>
          <View style={styles.taxTable}>
            <View style={styles.taxRow}>
              <Text style={[styles.taxColDetails, { fontWeight: "bold" }]}>Tax Details</Text>
              <Text style={[styles.taxColAmount, { fontWeight: "bold" }]}>Taxable Amount (USD)</Text>
              <Text style={[styles.taxColTax, { fontWeight: "bold" }]}>Tax Amount (USD)</Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.taxColDetails}>Out of Scope</Text>
              <Text style={styles.taxColAmount}>3,000.00</Text>
              <Text style={styles.taxColTax}>0.00</Text>
            </View>
            <View style={styles.taxRowBold}>
              <Text style={[styles.taxColDetails, { fontWeight: "bold" }]}>Total</Text>
              <Text style={[styles.taxColAmount, { fontWeight: "bold" }]}>USD 3,000.00</Text>
              <Text style={[styles.taxColTax, { fontWeight: "bold" }]}>USD 0.00</Text>
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber} render={() => "1"} fixed />
      </Page>

      {/* Page 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.page2Section}>
          <Text style={styles.page2Header}>Notes</Text>
          <Text style={styles.page2Line}>Thank you for your business!</Text>
          <Text style={styles.page2Line}>For any queries, please contact us at +971 50 810 7712</Text>
          <Text style={styles.page2Line}>This is a computer-generated invoice and does not require a signature.</Text>
        </View>

        <View style={styles.page2Section}>
          <Text style={styles.page2Header}>Terms & Conditions</Text>
          <Text style={styles.page2Line}>50% upfront — due upon signature of the proposal — to initiate research, scripting, and production.</Text>
          <Text style={styles.page2Line}>50% on delivery — due upon final approved delivery as mentioned in the terms of the proposal for the AutoHub KSA Q2 AI vs Real Engagement Pilot.</Text>
        </View>

        <View style={styles.page2Section}>
          <Text style={styles.page2Header}>PAYMENT INFORMATION</Text>
          <Text style={styles.page2Line}>Account Holder: XLUXIVE DIGITAL MARKETING LLC</Text>
          <Text style={styles.page2Line}>IBAN: AE590860000009339072484</Text>
          <Text style={styles.page2Line}>SWIFT/BIC: WIOBAEADXXX</Text>
          <Text style={styles.page2Line}>Bank Address: Office M-44, The Curve Building, Al Quoz, Al Qouz Third, Dubai, UAE</Text>
        </View>

        <Text style={styles.pageNumber} render={() => "2"} fixed />
      </Page>
    </Document>
  );
}

const outPath = path.join(process.cwd(), "XMA-2026-000048-DCMena-50pct.pdf");
await renderToFile(<Invoice />, outPath);
console.log(`PDF written to: ${outPath}`);
