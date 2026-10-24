"use client";

import { Printer } from "lucide-react";

export default function ReceiptButton() {
  return <button type="button" className="outline-button receipt-button" onClick={() => window.print()}><Printer size={15} /> Print receipt</button>;
}
