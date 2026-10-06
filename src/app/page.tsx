"use client";

import TicketForm from "@/components/TicketForm";
import { Calendar, MapPin, Heart, Music, Users, Sparkles, ArrowDown, Ticket, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const scrollToTicket = () => {
    document.getElementById("ticket-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="flex-1 bg-warm-cream selection:bg-warm-orange selection:text-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-warm-dark">
          <Image
            src="/band-hero.jpg"
            alt="Đọng Band Live"
            fill
            className="object-cover object-center scale-105 animate-[slow-zoom_20s_ease-in-out_infinite_alternate] opacity-60 mix-blend-screen"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-dark via-transparent to-transparent z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center text-white mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-warm-cream text-sm font-medium mb-8 backdrop-blur-md uppercase tracking-widest shadow-xl">
            <Sparkles size={16} className="text-warm-orange-light" />
            Show Âm Nhạc Gây Quỹ
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-playfair font-bold mb-6 tracking-tight drop-shadow-2xl">
            Đọng Lại Trong Tim
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl font-light text-warm-cream/90 max-w-3xl mx-auto mb-10 drop-shadow-lg">
            Nơi âm nhạc vang lên, tình yêu thương lan tỏa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-warm-cream mb-10">
            <div className="flex items-center gap-3 bg-warm-dark/40 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md shadow-2xl hover:bg-warm-dark/60 transition-colors w-full sm:w-auto">
              <Calendar className="text-warm-orange shrink-0" size={24} />
              <div className="text-left">
                <p className="text-xs text-white/50 uppercase tracking-wider">Thời gian</p>
                <p className="font-semibold text-base sm:text-lg">16:30 - 02/01/2027</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-warm-dark/40 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md shadow-2xl hover:bg-warm-dark/60 transition-colors w-full sm:w-auto">
              <MapPin className="text-warm-orange shrink-0" size={24} />
              <div className="text-left">
                <p className="text-xs text-white/50 uppercase tracking-wider">Địa điểm</p>
                <p className="font-semibold text-base sm:text-lg truncate max-w-[200px] sm:max-w-none">NOW Coffee and Tea, Tân Bình</p>
              </div>
            </div>
          </div>

          <button
            onClick={scrollToTicket}
            className="inline-flex items-center gap-3 px-8 py-4 bg-warm-orange hover:bg-warm-brown text-white font-semibold rounded-full shadow-[0_0_40px_rgba(212,123,74,0.4)] hover:shadow-[0_0_60px_rgba(139,90,51,0.6)] transition-all scale-100 hover:scale-105 w-full sm:w-auto justify-center"
          >
            <Ticket size={20} />
            Đặt vé ngay
          </button>
        </div>

        <button onClick={scrollToTicket} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50 hover:text-white transition-colors cursor-pointer">
          <ArrowDown size={32} />
        </button>
      </section>

      {/* GIỚI THIỆU SỰ KIỆN & BAND */}
      <section className="py-24 bg-warm-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-warm-orange/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

            {/* Ảnh Band */}
            <div className="w-full lg:w-1/2 relative group px-4 sm:px-0">
              <div className="absolute inset-0 bg-warm-orange/20 rounded-3xl translate-x-4 translate-y-4 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-4 sm:border-8 border-white shadow-2xl bg-warm-dark/10">
                <Image
                  src="/band-about.jpg"
                  alt="Đọng Band"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Nội dung */}
            <div className="w-full lg:w-1/2 space-y-8 relative z-10">
              <div>
                <h3 className="text-warm-orange font-semibold tracking-widest uppercase text-sm mb-2">Về chúng tôi</h3>
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-warm-dark mb-6 leading-tight">
                  Âm nhạc kết nối<br />những tâm hồn
                </h2>
                <div className="w-24 h-1.5 bg-warm-orange rounded-full mb-8" />

                <p className="text-base sm:text-lg text-warm-brown leading-relaxed mb-6 font-light">
                  <strong className="text-warm-dark font-medium">"Đọng Lại Trong Tim"</strong> là một đêm nhạc acoustic mộc mạc, nơi chúng ta có thể tạm gác lại những lo âu hối hả của cuộc sống, ngồi lại bên nhau trong một không gian gần gũi.
                </p>
                <p className="text-base sm:text-lg text-warm-brown leading-relaxed font-light">
                  Đọng Band tin rằng âm nhạc không chỉ để nghe, mà còn để chia sẻ. Toàn bộ lợi nhuận từ việc bán vé và quyên góp trong đêm nhạc sẽ được chúng tôi sử dụng vào mục đích thiện nguyện, mang lại một chút ấm áp cho những hoàn cảnh khó khăn.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand hover:shadow-md transition-shadow group">
                  <Music className="text-warm-orange w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-warm-dark mb-2">Acoustic Live</h4>
                  <p className="text-sm text-warm-brown">Những bản tình ca nhẹ nhàng, sâu lắng.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-sand hover:shadow-md transition-shadow group">
                  <Heart className="text-red-400 w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-warm-dark mb-2">Gây quỹ từ thiện</h4>
                  <p className="text-sm text-warm-brown">100% lợi nhuận dành cho các hoạt động ý nghĩa.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ĐẶT VÉ SECTION */}
      <section id="ticket-section" className="py-24 bg-warm-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-warm-orange/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">Giữ chỗ cho đêm nhạc</h2>
            <p className="text-warm-cream/70 max-w-2xl mx-auto text-lg">
              Chỉ có giới hạn 100 vé để đảm bảo không gian ấm cúng nhất. Hãy nhanh tay đặt vé và cùng lan tỏa yêu thương cùng Đọng Band.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Cột trái: Thông tin quyên góp */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm text-white">
                <div className="w-12 h-12 bg-warm-orange/20 rounded-full flex items-center justify-center mb-6">
                  <Heart className="text-warm-orange-light" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Mở rộng tấm lòng</h3>
                <p className="text-warm-cream/70 leading-relaxed mb-6">
                  Ngoài việc mua vé, bạn hoàn toàn có thể đóng góp thêm một khoản nhỏ tùy tâm vào quỹ từ thiện của chương trình.
                </p>
                <div className="bg-warm-dark/50 p-4 rounded-xl border border-white/5">
                  <p className="text-sm font-medium italic text-warm-orange-light">
                    "Một chút yêu thương cho đi, là một đời bình an ở lại."
                  </p>
                </div>
              </div>

              <div className="bg-warm-orange/10 border border-warm-orange/20 p-6 rounded-3xl backdrop-blur-sm text-warm-orange-light flex items-center gap-4 hover:bg-warm-orange/20 transition-colors">
                <Users size={32} />
                <div>
                  <h4 className="font-bold">Số lượng có hạn</h4>
                  <p className="text-sm text-warm-orange-light/70">Chỉ còn trống vài ghế cho đêm diễn</p>
                </div>
              </div>
            </div>

            {/* Cột phải: Form đặt vé */}
            <div className="lg:col-span-7">
              <TicketForm />
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-warm-dark border-t border-white/10 pt-16 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">

            {/* Cột trái: Socials */}
            <div>
              <h3 className="text-3xl font-playfair font-bold text-white mb-6">Đọng Band</h3>
              <p className="text-warm-cream/70 mb-8 max-w-sm leading-relaxed">
                Lan tỏa yêu thương qua từng nốt nhạc. Theo dõi chúng tôi trên các nền tảng để không bỏ lỡ những sự kiện mới nhất.
              </p>
              <div className="flex items-center gap-4">
                {/* Facebook Icon */}
                <a href="https://www.facebook.com/bannhacdong" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-warm-orange transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                {/* YouTube Icon */}
                <a href="https://www.youtube.com/@bannhacdong2025" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-warm-orange transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
                {/* TikTok Icon */}
                <a href="https://www.tiktok.com/@bannhacdong" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-warm-orange transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.97-1.539 4.99 4.99 0 0 1-1.134-2.253h-3.453v14.396a3.338 3.338 0 0 1-4.114 3.001 3.372 3.372 0 0 1-2.163-1.773 3.342 3.342 0 0 1-.224-2.583 3.34 3.34 0 0 1 2.37-2.122 3.36 3.36 0 0 1 3.003.585V10.87a6.746 6.746 0 0 0-4.043-.637 6.843 6.843 0 0 0-4.802 4.3 6.784 6.784 0 0 0 .452 5.234 6.868 6.868 0 0 0 4.407 3.588 6.756 6.756 0 0 0 6.096-1.189 6.83 6.83 0 0 0 2.26-5.836V7.438a8.314 8.314 0 0 0 5.315 1.942v-3.46a4.773 4.773 0 0 1-3.97-1.539 4.99 4.99 0 0 1-1.134-2.253h-3.453V6.686z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Cột phải: Contact Info */}
            <div className="md:text-right flex flex-col md:items-end">
              <h4 className="text-xl font-bold text-white mb-6">Liên hệ với chúng tôi</h4>
              <ul className="space-y-4 text-warm-cream/80">
                <li className="flex items-start md:justify-end gap-3">
                  <span className="md:order-1">0931043806 (Nhật Quang - Trưởng BTC)</span>
                  <Phone size={20} className="text-warm-orange md:order-2 shrink-0 mt-0.5" />
                </li>
                <li className="flex items-start md:justify-end gap-3">
                  <span className="md:order-1">dongband2025@gmail.com</span>
                  <Mail size={20} className="text-warm-orange md:order-2 shrink-0 mt-0.5" />
                </li>
                <li className="flex items-start md:justify-end gap-3">
                  <span className="md:order-1">Đọng Band Studio<br />331 Hồng Lạc, P. Bảy Hiền, HCM</span>
                  <MapPin size={20} className="text-warm-orange md:order-2 shrink-0 mt-0.5" />
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-warm-cream/50 text-sm">
              &copy; 2027 Đọng Lại Trong Tim - Đọng Band. Designed with ♥
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
