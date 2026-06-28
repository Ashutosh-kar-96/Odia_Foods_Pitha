import { useRef, useState } from "react";
import { X, Printer, Tag, Receipt } from "lucide-react";
import { money } from "../utils/format";

const GST_RATE = 0.18;

export default function InvoicePrintModal({ order, onClose }) {
  const [discountType, setDiscountType] = useState("flat");
  const [discountValue, setDiscountValue] = useState("");
  const printRef = useRef(null);

  if (!order) return null;

  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const discountAmount = (() => {
    const val = parseFloat(discountValue) || 0;
    if (discountType === "percent") return Math.min((subtotal * val) / 100, subtotal);
    return Math.min(val, subtotal);
  })();

  const taxableAmount = subtotal - discountAmount;
  const gstAmount     = taxableAmount * GST_RATE;
  const grandTotal    = taxableAmount + gstAmount;

  const invoiceNumber = `INV-${order.order_number}`;
  const invoiceDate   = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(order.created_at));

  const fmt = (val) =>
    "₹" + Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handlePrint = () => {
    const itemRows = order.items.map((item, i) => `
      <tr style="background:${i % 2 === 1 ? "#fdf8f5" : "#ffffff"}; border-bottom: 1px solid #f5ece5;">
        <td style="padding:10px 14px; font-size:13px; color:#1a1a1a;">
          <div style="font-weight:600;">${item.product_name}</div>
          ${item.size ? `<div style="font-size:11px; color:#888; margin-top:2px;">${item.size}</div>` : ""}
        </td>
        <td style="padding:10px 14px; font-size:13px; color:#555; text-align:center;">${item.quantity}</td>
        <td style="padding:10px 14px; font-size:13px; color:#555; text-align:right;">${fmt(item.price)}</td>
        <td style="padding:10px 14px; font-size:13px; font-weight:600; color:#1a1a1a; text-align:right;">${fmt(Number(item.price) * Number(item.quantity))}</td>
      </tr>
    `).join("");

    const discountRow = discountAmount > 0 ? `
      <tr>
        <td style="padding:5px 10px; font-size:13px; color:#c0392b;">
          Discount${discountType === "percent" && discountValue ? ` (${discountValue}%)` : ""}
        </td>
        <td style="padding:5px 10px; font-size:13px; color:#c0392b; text-align:right; font-weight:500;">
          − ${fmt(discountAmount)}
        </td>
      </tr>
    ` : "";

    const win = window.open("", "_blank", "width=860,height=800");
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${invoiceNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 48px; }
    @media print { body { padding: 0; } @page { margin: 15mm; } }
  </style>
</head>
<body>
<div style="max-width:720px; margin:0 auto;">

  <!-- Header -->
  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px;">
    <div>
      <div style="font-size:24px; font-weight:700; color:#8B1A1A; letter-spacing:-0.5px;">Odisha Pitha Marketplace</div>
      <div style="font-size:11px; color:#999; margin-top:4px;">Authentic Traditional Delicacies · Odisha, India</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:22px; font-weight:700; color:#8B1A1A; letter-spacing:1px;">INVOICE</div>
      <div style="font-size:12px; color:#666; margin-top:4px;">#${invoiceNumber}</div>
      <div style="font-size:12px; color:#888; margin-top:2px;">${invoiceDate}</div>
    </div>
  </div>

  <!-- Divider -->
  <div style="border-top:1.5px solid #f0e0d8; margin-bottom:24px;"></div>

  <!-- Bill To + Order Info -->
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:28px;">
    <div>
      <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#8B1A1A; margin-bottom:8px;">Bill To</div>
      <div style="font-size:14px; font-weight:600; color:#1a1a1a;">${order.customer_name}</div>
      <div style="font-size:13px; color:#555; margin-top:4px; line-height:1.6;">${order.shipping_address}</div>
    </div>
    <div>
      <div style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#8B1A1A; margin-bottom:8px;">Order Details</div>
      <table style="font-size:13px; color:#555; border-collapse:collapse;">
        <tr><td style="padding:2px 0; padding-right:12px;">Order No</td><td style="font-weight:600; color:#1a1a1a;">${order.order_number}</td></tr>
        <tr><td style="padding:2px 0; padding-right:12px;">Date</td><td style="font-weight:600; color:#1a1a1a;">${invoiceDate}</td></tr>
        <tr><td style="padding:2px 0; padding-right:12px;">Payment</td><td style="font-weight:600; color:#15803d;">${order.payment_status || "Paid"}</td></tr>
      </table>
    </div>
  </div>

  <!-- Items Table -->
  <table style="width:100%; border-collapse:collapse; margin-bottom:24px; border-radius:10px; overflow:hidden; border:1px solid #f0e0d8;">
    <thead>
      <tr style="background:#8B1A1A;">
        <th style="padding:11px 14px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#fff; text-align:left;">Item</th>
        <th style="padding:11px 14px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#fff; text-align:center;">Qty</th>
        <th style="padding:11px 14px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#fff; text-align:right;">Unit Price</th>
        <th style="padding:11px 14px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#fff; text-align:right;">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display:flex; justify-content:flex-end; margin-bottom:28px;">
    <table style="width:300px; border-collapse:collapse;">
      <tr>
        <td style="padding:6px 10px; font-size:13px; color:#666;">Subtotal</td>
        <td style="padding:6px 10px; font-size:13px; color:#1a1a1a; font-weight:500; text-align:right;">${fmt(subtotal)}</td>
      </tr>
      ${discountRow}
      <tr style="border-top:1px solid #f0e0d8;">
        <td style="padding:6px 10px; font-size:13px; color:#666;">Taxable Amount</td>
        <td style="padding:6px 10px; font-size:13px; color:#1a1a1a; font-weight:500; text-align:right;">${fmt(taxableAmount)}</td>
      </tr>
      <tr>
        <td style="padding:5px 10px; font-size:13px; color:#666;">CGST (9%)</td>
        <td style="padding:5px 10px; font-size:13px; color:#1a1a1a; font-weight:500; text-align:right;">${fmt(gstAmount / 2)}</td>
      </tr>
      <tr>
        <td style="padding:5px 10px; font-size:13px; color:#666;">SGST (9%)</td>
        <td style="padding:5px 10px; font-size:13px; color:#1a1a1a; font-weight:500; text-align:right;">${fmt(gstAmount / 2)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:4px 0;">
          <div style="background:#8B1A1A; border-radius:8px; display:flex; justify-content:space-between; align-items:center; padding:12px 14px; margin-top:6px;">
            <span style="font-size:15px; font-weight:700; color:#fff;">Grand Total</span>
            <span style="font-size:17px; font-weight:700; color:#fff;">${fmt(grandTotal)}</span>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <!-- GST Note -->
  <div style="border-top:1px dashed #e0d0c8; padding-top:14px; margin-bottom:24px;">
    <p style="font-size:11px; color:#999; line-height:1.6;">
      <strong style="color:#666;">GST Note:</strong>
      Total GST of <strong style="color:#555;">${fmt(gstAmount)}</strong> at 18%
      split equally as CGST 9% + SGST 9% on taxable amount of
      <strong style="color:#555;">${fmt(taxableAmount)}</strong>.
    </p>
  </div>

  <!-- Footer -->
  <div style="border-top:1.5px solid #f0e0d8; padding-top:16px; display:flex; justify-content:space-between; align-items:center;">
    <p style="font-size:11px; color:#bbb;">This is a computer-generated invoice and does not require a signature.</p>
    <p style="font-size:13px; font-weight:600; color:#8B1A1A;">Thank you for your order! 🙏</p>
  </div>

</div>
<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
</body>
</html>`);
    win.document.close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl flex flex-col">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-temple/10 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Receipt size={20} className="text-sindoor" />
            <h2 className="font-display text-lg font-bold text-temple">Invoice Preview</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink/40 hover:bg-rice hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Discount controls */}
        <div className="px-6 py-4 bg-rice border-b border-temple/10 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink/70">
            <Tag size={15} className="text-sindoor" />
            Discount
          </div>
          <div className="flex rounded-lg border border-temple/15 overflow-hidden text-sm font-semibold">
            {["flat", "percent"].map((t) => (
              <button
                key={t}
                onClick={() => { setDiscountType(t); setDiscountValue(""); }}
                className={`px-4 py-1.5 transition-colors ${
                  discountType === t
                    ? "bg-temple text-white"
                    : "bg-white text-ink/60 hover:bg-haldi/20"
                }`}
              >
                {t === "flat" ? "₹ Flat" : "% Off"}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="0"
            max={discountType === "percent" ? 100 : subtotal}
            placeholder={discountType === "flat" ? "Enter ₹ amount" : "Enter %"}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="input w-44 py-1.5 text-sm"
          />
          {discountAmount > 0 && (
            <span className="text-sm font-semibold text-sindoor">
              − {money(discountAmount)} saved
            </span>
          )}
        </div>

        {/* Preview area */}
        <div className="px-6 py-6 flex-1" ref={printRef}>

          {/* Invoice header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-2xl font-bold text-temple font-display">Odisha Pitha Marketplace</p>
              <p className="text-xs text-ink/40 mt-1">Authentic Traditional Delicacies · Odisha, India</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-temple">INVOICE</p>
              <p className="text-sm text-ink/50 mt-1">#{invoiceNumber}</p>
              <p className="text-xs text-ink/40 mt-0.5">{invoiceDate}</p>
            </div>
          </div>

          <hr className="border-temple/10 mb-5" />

          {/* Bill to / Order info */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-temple mb-1.5">Bill To</p>
              <p className="text-sm font-semibold text-ink">{order.customer_name}</p>
              <p className="text-sm text-ink/60 mt-0.5 leading-relaxed">{order.shipping_address}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-temple mb-1.5">Order Details</p>
              <p className="text-sm text-ink/60">Order No: <span className="font-semibold text-ink">{order.order_number}</span></p>
              <p className="text-sm text-ink/60 mt-0.5">Date: <span className="font-semibold text-ink">{invoiceDate}</span></p>
              <p className="text-sm text-ink/60 mt-0.5">Payment: <span className="font-semibold text-green-700">{order.payment_status || "Paid"}</span></p>
            </div>
          </div>

          {/* Items table */}
          <div className="overflow-x-auto rounded-xl border border-temple/10 mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-temple text-white">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Item</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider">Qty</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider">Unit Price</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className={`border-b border-temple/8 last:border-0 ${i % 2 === 1 ? "bg-rice/60" : "bg-white"}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{item.product_name}</p>
                      {item.size && <p className="text-xs text-ink/45 mt-0.5">{item.size}</p>}
                    </td>
                    <td className="px-4 py-3 text-center text-ink/70">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-ink/70">{money(item.price)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink">{money(Number(item.price) * Number(item.quantity))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-1.5">
              <div className="flex justify-between text-sm text-ink/60 px-1">
                <span>Subtotal</span>
                <span className="font-medium text-ink">{money(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-sindoor px-1">
                  <span>Discount{discountType === "percent" && discountValue ? ` (${discountValue}%)` : ""}</span>
                  <span className="font-medium">− {money(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-ink/60 px-1">
                <span>Taxable Amount</span>
                <span className="font-medium text-ink">{money(taxableAmount)}</span>
              </div>
              <div className="border-t border-temple/10 pt-1.5">
                <div className="flex justify-between text-sm text-ink/60 px-1">
                  <span>CGST (9%)</span>
                  <span className="font-medium text-ink">{money(gstAmount / 2)}</span>
                </div>
                <div className="flex justify-between text-sm text-ink/60 px-1 mt-1">
                  <span>SGST (9%)</span>
                  <span className="font-medium text-ink">{money(gstAmount / 2)}</span>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center rounded-xl bg-temple px-4 py-3">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <span className="text-lg font-bold text-white">{money(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* GST note */}
          <div className="mt-6 pt-4 border-t border-dashed border-temple/15">
            <p className="text-xs text-ink/40">
              <span className="font-semibold text-ink/55">GST Note:</span> Total GST of{" "}
              <span className="font-semibold text-ink/55">{money(gstAmount)}</span> at 18%
              split equally as CGST 9% + SGST 9% on taxable amount of{" "}
              <span className="font-semibold text-ink/55">{money(taxableAmount)}</span>.
            </p>
          </div>

          {/* Invoice footer */}
          <div className="mt-6 pt-4 border-t border-temple/10 flex justify-between items-center">
            <p className="text-xs text-ink/35">This is a computer-generated invoice and does not require a signature.</p>
            <p className="text-sm font-semibold text-temple">Thank you for your order! 🙏</p>
          </div>

        </div>

        {/* Modal footer */}
        <div className="sticky bottom-0 bg-white border-t border-temple/10 px-6 py-4 flex justify-between items-center gap-3">
          <div className="text-xs text-ink/40">GST @ 18% applied on taxable amount after discount</div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary text-sm px-5 py-2.5">Close</button>
            <button
              onClick={handlePrint}
              className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2"
            >
              <Printer size={15} />
              Print Invoice
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}