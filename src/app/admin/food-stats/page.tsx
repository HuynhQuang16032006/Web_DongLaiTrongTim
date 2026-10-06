"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, Loader2, BarChart2 } from "lucide-react";

export default function FoodStatsPage() {
  const [data, setData] = useState<{ summary: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/admin/orders?t=${new Date().getTime()}`);
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
              <BarChart2 className="text-purple-600" /> Thống kê đồ uống
            </h1>
            <p className="text-warm-brown text-sm">Số lượng các món nước đã được khách hàng chọn</p>
          </div>
        </div>

        {data?.summary?.foodStats && Object.keys(data.summary.foodStats).length > 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand">
            <div className="flex flex-wrap gap-4">
              {Object.entries(data.summary.foodStats).map(([name, qty]: [string, any]) => (
                <div key={name} className="flex items-center gap-2 px-4 py-3 bg-warm-cream rounded-xl border border-warm-sand min-w-[200px] shadow-sm">
                  <span className="font-medium text-warm-dark flex-1">{name}</span>
                  <span className="px-3 py-1 bg-warm-orange/20 text-warm-orange-light rounded-md font-bold text-lg">x{qty}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-warm-sand text-center">
            <p className="text-warm-brown text-lg">Chưa có dữ liệu gọi món nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
