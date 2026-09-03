"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TopUpRobux } from "@/components/TopUpRobux";
import { FormOrder } from "@/components/FormOrder";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { PaymentFooter } from "@/components/PaymentFooter";

// Modals
import { OrderModal } from "@/components/modals/OrderModal";
import { AllPackagesModal } from "@/components/modals/AllPackagesModal";
import { CaraOrderModal } from "@/components/modals/CaraOrderModal";
import { FaqModal } from "@/components/modals/FaqModal";
import CustomerReviewModal from "@/components/modals/CustomerReviewModal";
import { WhatsAppSuccessModal } from "@/components/modals/WhatsAppSuccessModal";

// Default Initial Data & Types
import {
  ROBUX_PACKAGES as INITIAL_ROBUX_PACKAGES,
  ALL_ROBUX_PACKAGES as INITIAL_ALL_PACKAGES,
  TESTIMONIALS as INITIAL_TESTIMONIALS,
  PAYMENT_METHODS,
} from "@/data/landingData";
import { RobuxPackage, RobloxUser, Testimonial } from "@/types/landing";

// Review Token Listener Subcomponent
function ReviewTokenListener({
  onOpenReview,
}: {
  onOpenReview: (token: string) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("review_token");
    if (token) {
      onOpenReview(token);
    }
  }, [searchParams, onOpenReview]);
  return null;
}

export default function ZerlyGamersPage() {
  // Live API States
  const [packages, setPackages] = useState<RobuxPackage[]>(INITIAL_ROBUX_PACKAGES);
  const [allPackages, setAllPackages] = useState<RobuxPackage[]>(INITIAL_ALL_PACKAGES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [whatsappNumber, setWhatsappNumber] = useState("6285624595886");
  const [storeName, setStoreName] = useState("Zerly Gamers");
  const [logoPath, setLogoPath] = useState("/logo.png");
  const [qrisImagePath, setQrisImagePath] = useState("/qris.jpeg");

  // Selected Order State
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>(INITIAL_ROBUX_PACKAGES[2]); // Default 240 Robux
  const [userId, setUserId] = useState("");
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null);
  const [orderMethod, setOrderMethod] = useState<"website" | "whatsapp">("website");
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Review Token State
  const [reviewToken, setReviewToken] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);

  // WhatsApp Order Modal State
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [waInvoiceNumber, setWaInvoiceNumber] = useState("");
  const [waDirectLink, setWaDirectLink] = useState("");

  // Promo Banner State from Settings
  const [promoData, setPromoData] = useState<{
    isActive: boolean;
    robuxAmount: number;
    discountPrice: number;
    originalPrice?: number;
    tagline?: string;
    endDateFormatted?: string;
  } | null>(null);

  // Modals state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAllPackagesModal, setShowAllPackagesModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showCaraOrderModal, setShowCaraOrderModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenReview = useCallback((token: string) => {
    setReviewToken(token);
    setShowReviewModal(true);
  }, []);

  const handleCloseReview = () => {
    setShowReviewModal(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("review_token");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  };

  // 1. Fetch live products from /api/products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const active = json.data.filter((p: any) => p.is_active !== false);
          if (active.length > 0) {
            const mapped: RobuxPackage[] = active.map((p: any) => ({
              id: p.id,
              amount: Number(p.robux),
              priceFormatted: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
              priceNumber: Number(p.price),
              isBestSeller: p.badge === "POPULER" || p.badge === "PROMO" || p.robux === 240,
            }));

            setAllPackages(mapped);
            setPackages(mapped.slice(0, 6));

            // Select default best seller or first package
            const bestSeller = mapped.find((p) => p.isBestSeller) || mapped[0];
            if (bestSeller) setSelectedPackage(bestSeller);
          }
        }
      } catch (e) {
        console.error("Failed to load products from API:", e);
      }
    };

    fetchProducts();
  }, []);

  // 2. Fetch live testimonials with admin_reply from /api/testimonials
  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const approved = json.data.filter((t: any) => t.status === "approved" || !t.status);
        if (approved.length > 0) {
          const mapped: Testimonial[] = approved.map((t: any) => ({
            id: t.id,
            username: t.username || "@Gamer",
            avatar: t.image_path || "",
            text: t.comment || t.message || "Top up di Zerly Gamers selalu cepat & aman!",
            stars: Number(t.rating) || 5,
            adminReply: t.admin_reply || null,
          }));
          setTestimonials(mapped);
        }
      }
    } catch (e) {
      console.error("Failed to load testimonials from API:", e);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // 3. Fetch store settings from /api/settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          if (s.whatsapp_number) setWhatsappNumber(s.whatsapp_number);
          if (s.store_name) setStoreName(s.store_name);
          if (s.logo_image_path) setLogoPath(s.logo_image_path);
          if (s.qris_image_path) setQrisImagePath(s.qris_image_path);

          if (s.promo_active && s.promo_robux_amount) {
            let formattedEnd = "";
            if (s.promo_end_date) {
              const d = new Date(s.promo_end_date);
              formattedEnd = d.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
            }

            setPromoData({
              isActive: Boolean(s.promo_active),
              robuxAmount: Number(s.promo_robux_amount),
              discountPrice: Number(s.promo_discount_price) || 45000,
              originalPrice: Number(s.promo_discount_price) ? Math.round(Number(s.promo_discount_price) * 1.25) : 55000,
              tagline: s.promo_subtitle || undefined,
              endDateFormatted: formattedEnd || undefined,
            });
          } else {
            setPromoData(null);
          }
        }
      } catch (e) {
        console.error("Failed to load settings from API:", e);
      }
    };

    fetchSettings();
  }, []);

  const handleSelectPackage = (pkg: RobuxPackage) => {
    setSelectedPackage(pkg);
    setFormError("");
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleOpenOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setFormError("Silakan masukkan Username Roblox kamu terlebih dahulu!");
      const formElem = document.getElementById("form-order");
      if (formElem) formElem.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setFormError("");

    const displayAccount = robloxUser
      ? `${robloxUser.displayName} (@${robloxUser.name})`
      : userId;

    if (orderMethod === "whatsapp") {
      // Direct WhatsApp Order Flow
      const invoiceNumber = `ZG-${Math.floor(100000 + Math.random() * 900000)}`;
      const message = `Halo Admin ${storeName}, saya ingin order via WhatsApp:%0A%0A` +
        `*No Invoice:* ${invoiceNumber}%0A` +
        `*Paket:* ${selectedPackage.amount} Robux%0A` +
        `*Total Bayar:* ${selectedPackage.priceFormatted}%0A` +
        `*Akun Roblox:* ${displayAccount}%0A` +
        `*Metode Order:* Via WhatsApp Admin%0A%0A` +
        `Mohon segera diproses ya kak. Terima kasih! 💖`;

      const cleanWa = whatsappNumber.replace(/[^0-9]/g, "");
      const waLink = `https://wa.me/${cleanWa}?text=${message}`;

      setWaInvoiceNumber(invoiceNumber);
      setWaDirectLink(waLink);
      setShowWhatsAppModal(true);

      // Save order in database
      try {
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_code: invoiceNumber,
            product_id: selectedPackage.id,
            roblox_username: displayAccount,
            customer_phone: "",
            robux: selectedPackage.amount,
            price: selectedPackage.priceNumber,
            payment_method: "WhatsApp Admin",
            payment_status: "pending",
            order_status: "masuk",
            roblox_user_id: robloxUser?.id || null,
          }),
        }).catch((err) => console.error("Order save error:", err));
      } catch (err) {
        console.error("Order save error:", err);
      }

      // Automatically launch WhatsApp window
      window.open(waLink, "_blank");
    } else {
      // Via Website: Open QRIS Checkout Modal
      setShowOrderModal(true);
    }
  };

  const handleConfirmOrder = async (details: {
    whatsappNumber: string;
    notes: string;
    proofFile: File | null;
    proofUrl: string | null;
  }) => {
    setOrderSuccess(true);
    const invoiceNumber = `#ZLY${Math.floor(10000000 + Math.random() * 90000000)}`;
    const displayAccount = robloxUser
      ? `${robloxUser.displayName} (@${robloxUser.name})`
      : userId;

    let uploadedProofUrl = details.proofUrl || null;

    // Upload customer proof file if attached
    if (details.proofFile) {
      try {
        const formData = new FormData();
        formData.append("file", details.proofFile);
        formData.append("type", "customer_payment_proof");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          uploadedProofUrl = uploadData.url;
        }
      } catch (uploadErr) {
        console.error("Failed to upload payment proof:", uploadErr);
      }
    }

    // Save order to live database via /api/orders
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roblox_username: userId,
          customer_phone: details.whatsappNumber,
          robux: selectedPackage.amount,
          price: selectedPackage.priceNumber,
          payment_method: "Website QRIS Otomatis",
          roblox_user_id: robloxUser?.id ? String(robloxUser.id) : undefined,
          customer_notes: details.notes,
          payment_proof_path: uploadedProofUrl,
        }),
      });
    } catch (err) {
      console.error("Failed to create order in DB:", err);
    }

    const cleanWa = whatsappNumber.replace(/[^0-9]/g, "");
    const message = `Halo Admin ${storeName}, saya telah order di website:%0A%0A` +
      `*No Invoice:* ${invoiceNumber}%0A` +
      `*Paket:* ${selectedPackage.amount} Robux%0A` +
      `*Total Bayar:* ${selectedPackage.priceFormatted}%0A` +
      `*Akun Roblox:* ${displayAccount}%0A` +
      `*No. WhatsApp Pembeli:* ${details.whatsappNumber}%0A` +
      (details.notes ? `*Catatan:* ${details.notes}%0A` : "") +
      `*Metode Pembayaran:* QRIS Otomatis Website%0A%0A` +
      `Mohon segera dicek & dikirim Robux-nya ya kak. Terima kasih! 💖`;

    setTimeout(() => {
      window.open(`https://wa.me/${cleanWa}?text=${message}`, "_blank");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start text-[#333] relative overflow-x-hidden">
      {/* Background Floating Cute Gamer Elements */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-12 left-10 text-pink-300/40 text-4xl animate-float-slow">💖</div>
        <div className="absolute top-48 right-16 text-pink-300/40 text-3xl animate-sparkle">✨</div>
        <div className="absolute top-[40%] left-6 text-pink-300/40 text-2xl animate-float-slow">⭐</div>
        <div className="absolute top-[65%] right-10 text-pink-300/30 text-4xl animate-sparkle">🌸</div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-rose-200/35 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Content Container Landmark */}
      <main id="main-content" className="w-full max-w-[1240px] px-3 sm:px-6 py-4 flex flex-col gap-4 z-10">
        {/* Section 1: Navigation Bar */}
        <Navbar
          onOpenCaraOrder={() => setShowCaraOrderModal(true)}
          onOpenFaq={() => setShowFaqModal(true)}
          storeName={storeName}
          logoPath={logoPath}
          whatsappNumber={whatsappNumber}
        />

        {/* Section 2: Hero Section */}
        <HeroSection
          onOpenAllPackages={() => setShowAllPackagesModal(true)}
          promoData={promoData || undefined}
          onSelectPromoPackage={(amount) => {
            const found = allPackages.find((p) => p.amount === amount);
            if (found) {
              setSelectedPackage(found);
            }
          }}
        />

        {/* Section 3: Main Product & Order Grid */}
        <section id="topup" aria-label="Katalog Paket dan Form Pemesanan Robux" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start relative z-20">
          <TopUpRobux
            packages={packages}
            selectedPackage={selectedPackage}
            onSelectPackage={handleSelectPackage}
            onOpenAllPackages={() => setShowAllPackagesModal(true)}
          />

          <FormOrder
            selectedPackage={selectedPackage}
            onSelectPackage={handleSelectPackage}
            allPackages={allPackages}
            userId={userId}
            onUserIdChange={(val) => {
              setUserId(val);
              if (formError) setFormError("");
            }}
            robloxUser={robloxUser}
            onRobloxUserChange={setRobloxUser}
            orderMethod={orderMethod}
            onOrderMethodChange={setOrderMethod}
            formError={formError}
            onSubmit={handleOpenOrder}
          />
        </section>

        {/* Section 4: Why Choose Us & Testimonials (Compact, items-start to prevent vertical stretching) */}
        <section aria-label="Keunggulan dan Testimoni Pelanggan" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start relative z-20">
          <WhyChooseUs />
          <Testimonials
            testimonials={testimonials}
            currentIndex={currentTestimonialIndex}
            onPrev={handlePrevTestimonial}
            onNext={handleNextTestimonial}
            onOpenFaq={() => setShowFaqModal(true)}
          />
        </section>

        {/* Section 5: Payment Footer */}
        <div className="relative z-20">
          <PaymentFooter
            paymentMethods={PAYMENT_METHODS}
            storeName={storeName}
          />
        </div>
      </main>

      {/* Interactive QRIS Checkout Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setOrderSuccess(false);
        }}
        selectedPackage={selectedPackage}
        userId={userId}
        robloxUser={robloxUser}
        orderSuccess={orderSuccess}
        qrisImagePath={qrisImagePath}
        storeName={storeName}
        onConfirmOrder={handleConfirmOrder}
      />

      <AllPackagesModal
        isOpen={showAllPackagesModal}
        onClose={() => setShowAllPackagesModal(false)}
        allPackages={allPackages}
        selectedPackage={selectedPackage}
        onSelectPackage={handleSelectPackage}
      />

      <CaraOrderModal
        isOpen={showCaraOrderModal}
        onClose={() => setShowCaraOrderModal(false)}
      />

      <FaqModal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
      />

      {/* Review Token Query Listener */}
      <Suspense fallback={null}>
        <ReviewTokenListener onOpenReview={handleOpenReview} />
      </Suspense>

      {/* Modal Beri Testimoni / Ulasan Pelanggan */}
      {showReviewModal && reviewToken && (
        <CustomerReviewModal
          isOpen={showReviewModal}
          reviewToken={reviewToken}
          onClose={handleCloseReview}
          onReviewSubmitted={() => {
            fetchTestimonials();
          }}
        />
      )}

      {/* Modal Sukses Order via WhatsApp */}
      <WhatsAppSuccessModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        selectedPackage={selectedPackage}
        userId={userId}
        robloxUser={robloxUser}
        invoiceNumber={waInvoiceNumber}
        whatsappLink={waDirectLink}
        storeName={storeName}
      />
    </div>
  );
}
