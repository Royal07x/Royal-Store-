/* ==========================================================
   invoice.js — Invoice
   Builds a printable invoice for a placed order.
   ========================================================== */

window.RS = window.RS || {};

RS.Invoice = (function () {
  function generate(order) {
    RS.DB.write("invoice:" + order.id, {
      orderId: order.id,
      issuedAt: new Date().toISOString(),
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      deliveryFee: order.deliveryFee,
      total: order.total
    });
    return order.id;
  }

  function print(order) {
    const win = window.open("", "_blank");
    const rows = order.items
      .map((i) => `<tr><td>${i.name}</td><td>${i.qty}</td><td>₹${i.price}</td><td>₹${i.price * i.qty}</td></tr>`)
      .join("");
    win.document.write(`
      <html><head><title>Invoice ${order.id}</title>
      <style>body{font-family:sans-serif;padding:2rem;color:#222}
      table{width:100%;border-collapse:collapse;margin-top:1rem}
      td,th{border:1px solid #ccc;padding:8px;text-align:left}</style></head>
      <body>
        <h2>Royal Store — Invoice</h2>
        <p>Order: ${order.id} &nbsp; Date: ${new Date(order.placedAt).toLocaleDateString()}</p>
        <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>${rows}</tbody></table>
        <p style="margin-top:1rem">Subtotal: ₹${order.subtotal}<br>
        Discount: -₹${order.discount}<br>
        Delivery: ₹${order.deliveryFee}<br>
        <strong>Total: ₹${order.total}</strong></p>
      </body></html>
    `);
    win.document.close();
    win.print();
  }

  return { generate, print };
})();
