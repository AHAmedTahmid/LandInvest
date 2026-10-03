export const BRAND = {
  name: "গ্রীন ভ্যালী",
  sub: "আবাসন প্রকল্প",
  address: "১৩০৫/১, মুক্তিযোদ্ধা আব্দুর রফিক ভিলা (২য় তলা), ছোটগড়, জামালপুর-২০০০।",
  location: "জামালপুর।",
  sutra: "সূত্র নং:",
  phone: "০১৭১২-৬৫৪৭৮০, ০১৭১৮-১৪৭১১৬, ০১৭১২-৩০৩৫০২",
  email: "greenvalleyrp2025@gmail.com",
  officeLabel: "অফিসের ঠিকানা: ১৩০৫/১, মুক্তিযোদ্ধা আব্দুর রফিক ভিলা (২য় তলা), রোডনষ্ট, জামালপুর-২০০০।",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');
  *{font-family:'Noto Sans Bengali','Inter',sans-serif}
  .page{width:210mm;min-height:295mm;margin:0 auto;background:#fff;color:#0f3d1a;padding:12mm;box-sizing:border-box;position:relative}
  .h1{font-size:32px;font-weight:800;color:#0a4a1a;line-height:1}
  .h2{font-size:13px;color:#0a6b2a}
  .green{color:#0f5c1a}
  .bar{height:3px;background:linear-gradient(90deg,#eaf5c8,#0a6b2a);border-radius:2px}
  .card{border:1.5px solid #0a6b2a;border-radius:10px;overflow:hidden}
  .th{background:#eef6d8;font-weight:700;font-size:11px}
  .foot{background:#0a4a1a;color:#fff;border-radius:0 0 10px 10px;padding:10px 14px;display:flex;gap:16px;font-size:10px}
`;

export function letterhead(inner: string){
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="page">
    <div style="display:flex;align-items:center;gap:14px"><div style="width:78px;height:78px;border-radius:50%;background:#eaf5c8;display:flex;align-items:center;justify-content:center;font-size:34px">🏡</div><div><div class="h1">${BRAND.name}</div><div class="h2">— ${BRAND.sub} —</div><div style="font-size:12px">📍 ${BRAND.location}</div></div></div>
    <div style="border-top:2px dashed #0a6b2a;margin:10px 0"></div>
    <div style="display:flex;justify-content:space-between;font-size:11px"><span>${BRAND.sutra} ............................</span><span>তারিখ: ......./......./20.......</span></div>
    <div style="margin:18px 0;opacity:.08;text-align:center;font-size:120px">🏡</div>
    <div>${inner}</div>
    <div class="foot" style="position:absolute;left:12mm;right:12mm;bottom:12mm"><div><b>অফিসের ঠিকানা:</b><br/>${BRAND.address}</div><div style="border-left:1px solid #fff3;padding-left:12px"><b>মোবাইল নাম্বার:</b><br/>${BRAND.phone}</div><div style="border-left:1px solid #fff3;padding-left:12px"><b>জিমেইল:</b><br/>${BRAND.email}</div></div>
  </div></body></html>`;
}

export function moneyReceiptHtml(d:{receiptNo:string,date:string,buyerName:string,address:string,phone:string,plotNo:string,bookingNo:string,purpose:string,amount:number,amountWords:string,paymentMode:string}){
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
    .title{font-size:18px;font-weight:800;background:#0a4a1a;color:#fff;padding:8px 14px;border-radius:8px}
    .line{border-bottom:1px dotted #0a6b2a;padding:4px 0;font-size:12px}
  </style></head><body><div class="page">
    <div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:10px;align-items:center"><div style="width:62px;height:62px;border-radius:50%;background:#eaf5c8;display:flex;align-items:center;justify-content:center">🏡</div><div><div style="font-size:22px;font-weight:800;color:#0a4a1a">গ্রীন ভ্যালী — আবাসন প্রকল্প —</div><div style="font-size:11px">📍 ${BRAND.address}</div></div></div><div class="title">মানি রিসিপ্ট<br/><span style="font-size:12px;font-weight:400">MONEY RECEIPT</span></div></div>
    <div style="display:flex;justify-content:flex-end;gap:18px;font-size:11px;margin-top:8px"><span>রিসিপ্ট নং: <b>${d.receiptNo}</b></span><span>তারিখ: ${d.date}</span></div>
    <div class="card" style="margin-top:10px;padding:12px">
      <div class="line">নাম : ${d.buyerName}</div>
      <div class="line">ঠিকানা : ${d.address || "-"}</div>
      <div class="line">মোবাইল নং : ${d.phone}</div>
      <div class="line">প্লট/ব্লক নং : ${d.plotNo} &nbsp; বুকিং নং : ${d.bookingNo}</div>
      <div class="line">বাবদ : ${d.purpose}</div>
      <div style="display:flex;gap:12px;margin-top:10px"><div style="flex:1"></div><div style="width:220px;border:1.5px solid #0a6b2a;border-radius:8px;overflow:hidden"><div style="background:#0a4a1a;color:#fff;text-align:center;font-size:12px;padding:6px">টাকার পরিমাণ</div><div style="padding:8px"><div style="background:#f1f8d8;padding:8px;border-radius:6px;font-weight:700">৳ ${d.amount.toLocaleString("en-BD")}</div><div style="font-size:11px;margin-top:8px">কথায়: ${d.amountWords}</div></div></div></div>
      <div style="background:#f1f8d8;border:1px solid #0a6b2a;border-radius:6px;padding:8px;margin-top:10px;font-size:11px">পরিশোধের মাধ্যম : ${d.paymentMode} &nbsp; বিবরণ: ${d.receiptNo}</div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:24px;font-size:11px"><i>Thank You!</i><div style="border:2px dashed #0a6b2a;border-radius:50%;padding:10px;text-align:center">ধন্যবাদ<br/><span style="font-size:9px">আপনার আস্থার জন্য</span></div><span>গ্রহণকারী কর্তৃপক্ষের স্বাক্ষর</span></div>
    <div class="foot"><span>বিশ্বাস, সততা ও স্বচ্ছতাই আমাদের অঙ্গীকার</span></div>
  </div></body></html>`;
}

export function paymentVoucherHtml(d:{voucherNo:string,date:string,receiverName:string,phone:string,amount:number,amountWords:string,purpose:string,accountHead:string,paymentMode:string,chequeNo:string,preparedBy:string}){
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}.row{border-bottom:1px solid #cfe6b8;padding:6px 0;font-size:12px}</style></head><body><div class="page">
    <div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:10px;align-items:center"><div style="width:56px;height:56px;border-radius:50%;background:#eaf5c8;display:flex;align-items:center;justify-content:center">🏡</div><div><div style="font-weight:800;color:#0a4a1a">গ্রীন ভ্যালী — আবাসন প্রকল্প —</div><div style="font-size:10px">${BRAND.address}</div></div></div><div style="background:#0a4a1a;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700">PAYMENT VOUCHER<br/><span style="color:#d9f99d">(পেমেন্ট ভাউচার)</span></div></div>
    <div style="display:flex;justify-content:space-between;font-size:11px;margin:8px 0"><span>ভাউচার নং: <b>${d.voucherNo}</b></span><span>তারিখ: ${d.date}</span></div>
    <div class="card" style="padding:12px">
      <div class="row">প্রদান করা হলো (গ্রহীতার নাম) : ${d.receiverName}</div>
      <div class="row">মোবাইল নম্বর : ${d.phone}</div>
      <div class="row">টাকার পরিমাণ : <span style="background:#f1f8d8;padding:2px 8px;border:1px solid #0a6b2a;border-radius:4px;font-weight:700">৳ ${d.amount.toLocaleString("en-BD")}</span></div>
      <div class="row">কথায় : ${d.amountWords}</div>
      <div class="row">খরচের বিবরণ : ${d.purpose}</div>
      <div class="row">হিসাবের খাত : ${d.accountHead}</div>
      <div class="row">পরিশোধের মাধ্যম : ${d.paymentMode}</div>
      <div class="row">চেক/লেনদেন নং : ${d.chequeNo || "-"}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:14px;background:#f1f8d8;border-radius:6px;padding:8px;font-size:11px"><div>প্রস্তুতকারী<br/>স্বাক্ষর: __________</div><div>অনুমোদনকারী<br/>স্বাক্ষর: __________</div><div>গ্রহীতার স্বাক্ষর<br/>স্বাক্ষর: __________</div></div>
    </div>
  </div></body></html>`;
}

export function pettyCashVoucherHtml(d:{voucherNo:string,date:string,receiverName:string,landOwner:string,landSize:string,mouzaNo:string,purpose:string,items:{date:string,desc:string,amount:number}[]}){
  const rows = d.items.map((it,i)=>`<tr><td style="border:1px solid #9ecf7a;padding:6px;text-align:center">${i+1}</td><td style="border:1px solid #9ecf7a;padding:6px">${it.date}</td><td style="border:1px solid #9ecf7a;padding:6px">${it.desc}</td><td style="border:1px solid #9ecf7a;padding:6px;text-align:right">৳ ${it.amount.toLocaleString("en-BD")}</td></tr>`).join("");
  const total = d.items.reduce((s,x)=>s+x.amount,0);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="page">
    <div style="display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:10px;align-items:center"><div style="width:56px;height:56px;border-radius:50%;background:#eaf5c8;display:flex;align-items:center;justify-content:center">🏡</div><div><div style="font-weight:800;color:#0a4a1a">গ্রীন ভ্যালী</div><div style="font-size:10px">${BRAND.address}</div></div></div><div style="background:#0a4a1a;color:#fff;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:700">পেটি ক্যাশ ভাউচার<br/>(PETTY CASH VOUCHER)</div></div>
    <div style="display:flex;justify-content:space-between;font-size:11px;margin:8px 0"><span>ভাউচার নং: <b>${d.voucherNo}</b></span><span>তারিখ: ${d.date}</span></div>
    <div class="card" style="padding:10px;font-size:11px"><div>প্রাপকের নাম : ${d.receiverName}</div><div>জমির মালিকের নাম : ${d.landOwner}</div><div>জমির পরিমাণ : ${d.landSize} শতাংশ</div><div>জমির মৌজা নং : ${d.mouzaNo}</div><div>খরচের উদ্দেশ্য : ${d.purpose}</div></div>
    <table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:11px"><thead><tr style="background:#d9ebc0"><th style="border:1px solid #9ecf7a;padding:6px">ক্রমিক নং</th><th style="border:1px solid #9ecf7a;padding:6px">তারিখ</th><th style="border:1px solid #9ecf7a;padding:6px">খরচের বিবরণ</th><th style="border:1px solid #9ecf7a;padding:6px">টাকার পরিমাণ</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="3" style="border:1px solid #9ecf7a;padding:6px;text-align:right;background:#d9ebc0;font-weight:700">মোট =</td><td style="border:1px solid #9ecf7a;padding:6px;text-align:right;font-weight:700">৳ ${total.toLocaleString("en-BD")}</td></tr></tfoot></table>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px;background:#f1f8d8;padding:8px;border-radius:6px;font-size:11px"><div>যাচাইকারী</div><div>অনুমোদনকারী</div><div>গ্রহীতার স্বাক্ষর</div></div>
    <div class="foot"><span>বিশ্বাস, সততা ও স্বচ্ছতাই আমাদের অঙ্গীকার</span></div>
  </div></body></html>`;
}

function numberToWordsBDT(n:number){
  // simple English words for demo; replace with Bengali if needed
  return n.toLocaleString("en-BD") + " Taka Only";
}

export { numberToWordsBDT };
