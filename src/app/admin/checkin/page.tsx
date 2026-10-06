"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { QrCode, Search, CheckCircle2, AlertCircle, ArrowLeft, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function CheckinPage() {
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Thông tin vé sau khi kiểm tra
  const [orderInfo, setOrderInfo] = useState<any>(null);
  
  // Số lượng khách thực tế có mặt lúc này
  const [checkinCount, setCheckinCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const handleCheckTicketRef = useRef<any>(null);

  const handleCheckTicket = async (e?: React.FormEvent, scannedCode?: string) => {
    if (e) e.preventDefault();
    const codeToSearch = scannedCode || orderCode;
    if (!codeToSearch) return;
    
    setLoading(true);
    setError("");
    setOrderInfo(null);
    setSuccessMsg("");

    try {
      const res = await axios.get(`/api/admin/checkin?code=${codeToSearch.toUpperCase()}`);
      setOrderInfo(res.data);
      const available = res.data.ticketQuantity - res.data.checkedInCount;
      setCheckinCount(available);
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = "/admin";
        return;
      }
      setError(err.response?.data?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  // Update ref to latest function
  handleCheckTicketRef.current = handleCheckTicket;

  useEffect(() => {
    // Khởi tạo máy quét QR
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
      false
    );

    scannerRef.current.render((decodedText) => {
      setOrderCode(decodedText);
      if (scannerRef.current && scannerRef.current.getState() !== 3) {
        try {
          scannerRef.current.pause(true); // Tạm dừng sau khi quét được
        } catch (e) {
          console.error("Lỗi khi pause scanner", e);
        }
      }
      // Tự động tìm kiếm khi quét được
      if (handleCheckTicketRef.current) {
        handleCheckTicketRef.current(undefined, decodedText);
      }
    }, (err) => {
      // Bỏ qua lỗi quét liên tục
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const submitCheckin = async () => {
    if (!orderCode || checkinCount <= 0) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await axios.post("/api/admin/checkin", { 
        orderCode: orderCode.toUpperCase(),
        checkinCount
      });
      setSuccessMsg(res.data.message);
      setOrderInfo(null);
      setOrderCode(""); // Reset để quét người tiếp theo
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi không xác định");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResumeScanner = () => {
    setSuccessMsg("");
    setOrderInfo(null);
    setOrderCode("");
    if (scannerRef.current) {
      try {
        scannerRef.current.resume();
      } catch (e) {
        console.error("Lỗi khi resume scanner", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream p-6 pb-20">
      <div className="max-w-xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 bg-white rounded-full shadow-sm text-warm-dark hover:bg-warm-sand">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-warm-dark">Kiểm soát vé</h1>
            <p className="text-warm-brown text-sm">Quét mã QR hoặc nhập mã thủ công</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-warm-sand">
          
          <div className={(!orderInfo && !successMsg) ? "block" : "hidden"}>
            {/* QR Scanner */}
            <div className="mb-8 rounded-xl overflow-hidden border-2 border-warm-sand">
              <div id="qr-reader" className="w-full"></div>
            </div>

            <form onSubmit={handleCheckTicket} className="space-y-4">
              <div>
                <label className="block text-left text-sm font-medium text-warm-dark mb-1">Mã vé (VD: DLTT123456)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-warm-sand bg-warm-cream/50 focus:outline-none focus:ring-2 focus:ring-warm-orange/50 uppercase font-mono tracking-wider"
                    placeholder="Nhập mã nếu không quét được..."
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                  />
                  <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-warm-dark text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Info Screen */}
          {orderInfo && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 mt-6">
              <div className="text-center pb-6 border-b border-warm-sand">
                <p className="text-sm text-warm-brown uppercase tracking-wider mb-2">Thông tin vé</p>
                <h3 className="text-3xl font-bold text-warm-dark mb-1">{orderInfo.customerName}</h3>
                <p className="text-warm-orange font-mono font-medium">{orderInfo.orderCode}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-warm-cream p-4 rounded-2xl">
                  <p className="text-sm text-warm-brown mb-1">Tổng số vé mua</p>
                  <p className="text-2xl font-bold text-warm-dark">{orderInfo.ticketQuantity}</p>
                </div>
                <div className="bg-warm-cream p-4 rounded-2xl">
                  <p className="text-sm text-warm-brown mb-1">Đã Check-in</p>
                  <p className="text-2xl font-bold text-green-600">{orderInfo.checkedInCount}</p>
                </div>
              </div>

              {orderInfo.ticketQuantity - orderInfo.checkedInCount > 0 ? (
                <div className="bg-warm-orange/10 p-6 rounded-2xl border border-warm-orange/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-warm-dark font-medium flex items-center gap-2">
                      <Users size={18} className="text-warm-orange" />
                      Số khách ĐANG CÓ MẶT (bây giờ)
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      max={orderInfo.ticketQuantity - orderInfo.checkedInCount}
                      value={checkinCount}
                      onChange={(e) => setCheckinCount(parseInt(e.target.value) || 1)}
                      className="w-20 text-center px-3 py-2 rounded-lg border border-warm-orange focus:outline-none focus:ring-2 focus:ring-warm-orange text-lg font-bold"
                    />
                  </div>
                  <button 
                    onClick={submitCheckin}
                    disabled={submitting}
                    className="w-full py-3 bg-warm-orange text-white font-bold rounded-xl hover:bg-warm-brown transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                    Xác nhận cho {checkinCount} khách vào
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center font-medium">
                  Tất cả khách của mã vé này đã check-in.
                </div>
              )}

              <button 
                onClick={handleResumeScanner}
                className="w-full py-3 text-warm-brown font-medium hover:text-warm-dark transition-colors"
              >
                Hủy / Quét mã khác
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 rounded-xl flex items-start gap-3 bg-red-50 text-red-700 border border-red-200">
              <AlertCircle className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mt-6 p-6 rounded-2xl bg-green-50 text-green-800 border border-green-200 text-center space-y-4">
              <CheckCircle2 size={48} className="mx-auto text-green-500" />
              <p className="font-bold text-lg">{successMsg}</p>
              <button 
                onClick={handleResumeScanner}
                className="px-6 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Tiếp tục quét
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
