window.Invoice={text(o){return `ROYAL STORE
Invoice: ${o.id}
Total: ₹${o.total}
Address: ${o.address}`},print(o){let w=open();w.document.write("<pre>"+this.text(o)+"</pre>");w.print()}};