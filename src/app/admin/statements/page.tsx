"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Loader2, Banknote } from "lucide-react";

export default function StatementsPage() {
  const [data, setData] = useState<{ orders: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin/orders");
        setData(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push("/admin");
        } else {
          setError("Lỗi tải dữ liệu");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-warm-cream"><Loader2 className="animate-spin text-warm-orange w-8 h-8" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-warm-cream text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-warm-cream p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 bg-white rounded-full shadow-sm text-warm-dark hover:bg-warm-sand">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-warm-dark flex items-center gap-2">
              <Banknote className="text-green-600" /> Sao kê thanh toán
            </h1>
            <p className="text-warm-brown text-sm">Lịch sử giao dịch chuyển khoản từ khách hàng</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-warm-sand/30 text-warm-dark font-medium border-b border-warm-sand">
                <tr>
                  <th className="p-3">Thời gian nhận</th>
                  <th className="p-3">Mã vé</th>
                  <th className="p-3">Khách hàng</th>
                  <th className="p-3">Số tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-sand/50">
                {(data?.orders || []).filter((o: any) => o.status === "PAID" || o.status === "CHECKED_IN").length > 0 ? (
                  (data?.orders || [])
                    .filter((o: any) => o.status === "PAID" || o.status === "CHECKED_IN")
                    .map((order: any) => (
                      <tr key={"tx-"+order.id} className="hover:bg-warm-cream/30">
                        <td className="p-3 text-warm-brown">{new Date(order.updatedAt).toLocaleString('vi-VN')}</td>
                        <td className="p-3 font-mono font-medium text-warm-dark">{order.orderCode}</td>
                        <td className="p-3 font-medium">{order.customerName}</td>
                        <td className="p-3 font-bold text-green-600">+{new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-warm-brown">Chưa có giao dịch thanh toán nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
