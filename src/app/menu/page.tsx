"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Coffee, Plus, Minus, CheckCircle2, ArrowRight, Ticket, Loader2, QrCode } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

// Đầy đủ menu quán NOW Coffee & Tea
const MENU_ITEMS = [
  // Milk Tea
  { id: 1, name: "Now ca cao trà sữa cacao", category: "Milk Tea" },
  { id: 2, name: "Now ô long trà sữa", category: "Milk Tea" },
  { id: 3, name: "Now socola trà sữa socola", category: "Milk Tea" },
  { id: 4, name: "Now matcha trà sữa matcha", category: "Milk Tea" },
  { id: 5, name: "Trà sữa kem trứng cháy", category: "Milk Tea" },
  { id: 6, name: "Sữa tươi trân châu đường đen", category: "Milk Tea" },
  { id: 7, name: "Sữa tươi cacao đường đen", category: "Milk Tea" },
  { id: 8, name: "Sữa tươi Now đường cháy", category: "Milk Tea" },
  { id: 9, name: "Sữa chua trân châu đường đen", category: "Milk Tea" },

  // Macchiato Tea
  { id: 10, name: "Hồng trà Macchiato", category: "Macchiato Tea" },
  { id: 11, name: "Lục trà Macchiato", category: "Macchiato Tea" },
  { id: 12, name: "Ô long Macchiato", category: "Macchiato Tea" },
  { id: 13, name: "Matcha Macchiato", category: "Macchiato Tea" },

  // Classic Coffee
  { id: 14, name: "Cà phê đá", category: "Classic Coffee" },
  { id: 15, name: "Cà phê sữa đá / nóng", category: "Classic Coffee" },
  { id: 16, name: "Cà phê đường đen", category: "Classic Coffee" },
  { id: 17, name: "Bạc xỉu đá", category: "Classic Coffee" },
  { id: 18, name: "Cà phê kem", category: "Classic Coffee" },
  { id: 19, name: "Cà phê muối", category: "Classic Coffee" },
  { id: 20, name: "Cà phê kem trứng", category: "Classic Coffee" },

  // Hot Coffee
  { id: 21, name: "Espresso", category: "Hot Coffee" },
  { id: 22, name: "Cappuccino", category: "Hot Coffee" },
  { id: 23, name: "Latte", category: "Hot Coffee" },
  { id: 24, name: "Americano", category: "Hot Coffee" },
  { id: 25, name: "Matcha Latte", category: "Hot Coffee" },
  { id: 26, name: "Taro Latte", category: "Hot Coffee" },
  { id: 27, name: "Cacao Latte", category: "Hot Coffee" },

  // Fruit Tea
  { id: 28, name: "Trà đào", category: "Fruit Tea" },
  { id: 29, name: "Trà ổi hồng pha lê", category: "Fruit Tea" },
  { id: 30, name: "Trà trái cây", category: "Fruit Tea" },
  { id: 31, name: "Trà dâu", category: "Fruit Tea" },
  { id: 32, name: "Lục trà vải bạc hà", category: "Fruit Tea" },
  { id: 33, name: "Trà ô long vải", category: "Fruit Tea" },
  { id: 34, name: "Trà ô long sen", category: "Fruit Tea" },
  { id: 35, name: "Trà ô long đác rim", category: "Fruit Tea" },
  { id: 36, name: "Trà mãng cầu", category: "Fruit Tea" },
  { id: 37, name: "Yakult thanh xuân", category: "Fruit Tea" },
  { id: 38, name: "Yakult tiên nữ", category: "Fruit Tea" },

  // Freeze
  { id: 39, name: "Cacao sữa đá", category: "Freeze" },
  { id: 40, name: "Matcha Freeze", category: "Freeze" },
  { id: 41, name: "Mocha Freeze", category: "Freeze" },
  { id: 42, name: "Cookie Mint Freeze", category: "Freeze" },
  { id: 43, name: "Blueberry Cookie Freeze", category: "Freeze" },
  { id: 44, name: "Đá xay (dâu, việt quất...)", category: "Freeze" },
  { id: 45, name: "Cacao đá xay", category: "Freeze" },
  { id: 46, name: "Taro Freeze", category: "Freeze" },

  // Soda
  { id: 47, name: "Ruby Soda", category: "Soda" },
  { id: 48, name: "Leo Soda", category: "Soda" },
  { id: 49, name: "Lemon Soda", category: "Soda" },
  { id: 50, name: "Diamond Soda", category: "Soda" },
  { id: 51, name: "Emerald Soda", category: "Soda" },
  { id: 52, name: "Blueberry Soda", category: "Soda" },

  // Others
  { id: 53, name: "Chanh đá viên", category: "Others" },
  { id: 54, name: "Lipton", category: "Others" },
  { id: 55, name: "Trà gừng mật ong", category: "Others" },
  { id: 56, name: "Dừa trái", category: "Others" },
  { id: 57, name: "Chanh muối", category: "Others" },
  { id: 58, name: "Đá me", category: "Others" },
  { id: 59, name: "Nước ép (cam, táo, thơm, dưa hấu, cà rốt)", category: "Others" },
  { id: 60, name: "Yaourt (đá, đác rim, trái cây)", category: "Others" },
  { id: 61, name: "Sinh tố dâu / bơ", category: "Others" },
  { id: 62, name: "Sinh tố hỗn hợp", category: "Others" },
  { id: 63, name: "Sinh tố dừa", category: "Others" },
  { id: 64, name: "Sinh tố mãng cầu", category: "Others" },
];

export default function MenuPage() {
  const [orderCode, setOrderCode] = useState("");
  const [ticketInfo, setTicketInfo] = useState<{ customerName: string, availableFree: number } | null>(null);
  
  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState<{ id: number; quantity: number; note: string }[]>([]);
  
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [success, setSuccess] = useState<{ tableNumber: string } | null>(null);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader-menu",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render((decodedText) => {
        setOrderCode(decodedText);
        setShowScanner(false);
        scanner.clear();
      }, () => {});

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [showScanner]);

  const checkTicketCode = async () => {
    if (!orderCode) return;
    setLoadingCode(true);
    setError("");
    try {
      const res = await axios.get(`/api/orders/food?code=${orderCode.toUpperCase()}`);
      setTicketInfo(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Mã vé không hợp lệ");
      setTicketInfo(null);
    } finally {
      setLoadingCode(false);
    }
  };

  const currentTotalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantity = (id: number, delta: number) => {
    if (!ticketInfo) return;

    if (delta > 0 && currentTotalQty >= ticketInfo.availableFree) {
      setError(`Bạn chỉ được chọn tối đa ${ticketInfo.availableFree} ly nước theo vé của mình.`);
      return;
    }
    setError("");

    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        const newQ = Math.max(0, existing.quantity + delta);
        if (newQ === 0) return prev.filter((item) => item.id !== id);
        return prev.map((item) => item.id === id ? { ...item, quantity: newQ } : item);
      }
      if (delta > 0) return [...prev, { id, quantity: 1, note: "" }];
      return prev;
    });
  };

  const handleNote = (id: number, note: string) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, note } : item)));
  };

  const getQuantity = (id: number) => cart.find((i) => i.id === id)?.quantity || 0;
  const getNote = (id: number) => cart.find((i) => i.id === id)?.note || "";

  const handleSubmit = async () => {
    if (!orderCode || !tableNumber || cart.length === 0) {
      setError("Vui lòng điền đủ số bàn và chọn ít nhất 1 món.");
      return;
    }
    setLoadingSubmit(true);
    setError("");

    const itemsDetail = cart.map(item => {
      const p = MENU_ITEMS.find(m => m.id === item.id);
      return { id: item.id, name: p?.name, quantity: item.quantity, category: p?.category, note: item.note };
    });

    try {
      await axios.post("/api/orders/food", {
        orderCode: orderCode.toUpperCase(),
        tableNumber,
        items: itemsDetail
      });
      setSuccess({ tableNumber });
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi đặt món. Vui lòng thử lại.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Gom nhóm menu theo category
  const categories = Array.from(new Set(MENU_ITEMS.map(item => item.category)));

  if (success) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full animate-in zoom-in">
          <CheckCircle2 size={64} className="mx-auto text-green-500 mb-6" />
          <h2 className="text-3xl font-playfair font-bold text-warm-dark mb-4">Gọi nước thành công!</h2>
          <p className="text-warm-brown mb-8">
            Quầy bar đã nhận được yêu cầu của bạn ở <strong>Bàn {success.tableNumber}</strong>. 
            Nhân viên sẽ sớm mang nước ra cho bạn nhé. Chúc bạn có một đêm nhạc tuyệt vời!
          </p>
          
          <button 
            onClick={() => { setSuccess(null); setCart([]); setTicketInfo(null); setOrderCode(""); }} 
            className="px-6 py-3 bg-warm-dark hover:bg-black text-white rounded-full font-medium w-full transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream pb-32">
      {/* Header */}
      <div className="bg-warm-dark text-white p-6 sticky top-0 z-10 shadow-md">
        <h1 className="text-2xl font-playfair font-bold text-center flex items-center justify-center gap-2">
          <Coffee className="text-warm-orange" /> Menu Đồ Uống
        </h1>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-6 mt-4">
        
        {/* Xác thực vé */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand space-y-4">
          {!ticketInfo ? (
            <div>
              <label className="block text-sm font-medium text-warm-dark mb-2">Nhập Mã Vé của bạn để chọn nước</label>
              
              {showScanner ? (
                <div className="mb-4 rounded-xl overflow-hidden border-2 border-warm-sand bg-white">
                  <div id="qr-reader-menu" className="w-full"></div>
                  <button onClick={() => setShowScanner(false)} className="w-full py-3 bg-warm-cream text-warm-dark font-medium text-sm text-center border-t border-warm-sand hover:bg-warm-sand transition-colors">
                    Đóng máy quét
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowScanner(true)} className="w-full mb-4 py-3 bg-warm-cream border border-warm-sand text-warm-dark rounded-xl flex items-center justify-center gap-2 hover:bg-warm-sand transition-colors font-medium">
                  <QrCode size={18} /> Quét mã QR trên vé
                </button>
              )}

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Hoặc nhập mã (VD: DLTT...)" 
                  value={orderCode} 
                  onChange={(e) => setOrderCode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-warm-sand uppercase focus:border-warm-orange outline-none font-mono text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && checkTicketCode()}
                />
                <button 
                  onClick={checkTicketCode}
                  disabled={loadingCode || !orderCode}
                  className="px-6 py-3 bg-warm-dark text-white rounded-xl hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingCode ? <Loader2 size={18} className="animate-spin" /> : <Ticket size={18} />}
                  Tiếp tục
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-warm-cream/30 p-4 rounded-xl border border-warm-orange/20">
              <div>
                <p className="text-sm text-warm-brown">Mã vé: <strong className="text-warm-dark">{orderCode.toUpperCase()}</strong></p>
                <p className="font-bold text-warm-dark mt-1">Xin chào, {ticketInfo.customerName}</p>
                {ticketInfo.availableFree > 0 ? (
                  <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
                    <CheckCircle2 size={14} /> Bạn được chọn <strong className="text-lg">{ticketInfo.availableFree}</strong> ly nước
                  </p>
                ) : (
                  <p className="text-sm text-warm-orange mt-2 font-medium">Bạn đã gọi đủ số nước cho vé này.</p>
                )}
              </div>
              <button 
                onClick={() => { setTicketInfo(null); setCart([]); setOrderCode(""); }}
                className="text-xs text-warm-brown underline hover:text-warm-dark whitespace-nowrap ml-2"
              >
                Đổi mã vé
              </button>
            </div>
          )}
        </div>

        {/* Menu (Chỉ hiện khi đã xác nhận vé) */}
        {ticketInfo && ticketInfo.availableFree > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand">
              <label className="block text-sm font-medium text-warm-dark mb-2">Bạn đang ngồi ở đâu?</label>
              <input 
                type="text" 
                placeholder="VD: Bàn 5, hoặc Hàng ghế 2..." 
                value={tableNumber} 
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-warm-sand focus:border-warm-orange outline-none"
              />
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-playfair font-bold text-warm-dark text-3xl">Menu NOW Coffee & Tea</h3>
                <p className="text-sm text-warm-brown italic mt-1">* Vui lòng chọn nước tương ứng với số lượng vé</p>
              </div>
              
              {categories.map((category) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-warm-orange/30 flex-1" />
                    <h4 className="font-bold text-warm-orange text-lg uppercase tracking-wider">{category}</h4>
                    <div className="h-px bg-warm-orange/30 flex-1" />
                  </div>
                  
                  {MENU_ITEMS.filter(i => i.category === category).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-warm-sand flex flex-col gap-3 transition-all hover:border-warm-orange/50">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 pr-4">
                          <p className="font-bold text-warm-dark">{item.name}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <button onClick={() => handleQuantity(item.id, -1)} className="w-8 h-8 rounded-full bg-warm-cream flex items-center justify-center text-warm-dark hover:bg-warm-sand transition-colors">
                            <Minus size={16} />
                          </button>
                          <span className="w-4 text-center font-bold text-lg">{getQuantity(item.id)}</span>
                          <button 
                            onClick={() => handleQuantity(item.id, 1)} 
                            disabled={currentTotalQty >= ticketInfo.availableFree}
                            className="w-8 h-8 rounded-full bg-warm-orange flex items-center justify-center text-white hover:bg-warm-brown transition-colors disabled:opacity-30 disabled:hover:bg-warm-orange"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {getQuantity(item.id) > 0 && (
                        <input
                          type="text"
                          placeholder="Ghi chú (ít đá, ít ngọt...)"
                          value={getNote(item.id)}
                          onChange={(e) => handleNote(item.id, e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-warm-cream/30 border border-warm-sand rounded-lg focus:outline-none focus:border-warm-orange text-warm-dark"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="sticky bottom-24 z-30">
            <p className="text-white text-center font-medium bg-red-500/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-red-600 animate-in slide-in-from-bottom-2">
              {error}
            </p>
          </div>
        )}

      </div>

      {/* Cart bottom bar */}
      {ticketInfo && currentTotalQty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-sand p-4 shadow-[0_-20px_40px_rgba(0,0,0,0.08)] z-20 animate-in slide-in-from-bottom-full">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-warm-dark font-medium">Đã chọn: <strong className="text-warm-orange text-lg">{currentTotalQty} / {ticketInfo.availableFree}</strong> ly</p>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={loadingSubmit} 
              className="px-6 py-4 bg-warm-dark text-white rounded-full font-bold flex items-center gap-2 hover:bg-black transition-transform active:scale-95 disabled:opacity-50 whitespace-nowrap shadow-lg"
            >
              {loadingSubmit ? <Loader2 size={20} className="animate-spin" /> : "Xác nhận gọi nước"} <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
