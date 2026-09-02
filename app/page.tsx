"use client";

import React, { useState, useEffect } from "react";
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

// Default Initial Data & Types
import {
  ROBUX_PACKAGES as INITIAL_ROBUX_PACKAGES,
  ALL_ROBUX_PACKAGES as INITIAL_ALL_PACKAGES,
  TESTIMONIALS as INITIAL_TESTIMONIALS,
  PAYMENT_METHODS,
} from "@/data/landingData";
import { RobuxPackage, RobloxUser, Testimonial } from "@/types/landing";

export default function ZerlyGamersPage() {
  // Live API States
  const [packages, setPackages] = useState<RobuxPackage[]>(INITIAL_ROBUX_PACKAGES);
  const [allPackages, setAllPackages] = useState<RobuxPackage[]>(INITIAL_ALL_PACKAGES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [whatsappNumber, setWhatsappNumber] = useState("6285624595886");
  const [storeName, setStoreName] = useState("Zerly Gamers");

  // Selected Order State
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>(INITIAL_ROBUX_PACKAGES[2]); // Default 240 Robux
  const [userId, setUserId] = useState("");
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null);
  const [orderMethod, setOrderMethod] = useState<"website" | "whatsapp">("website");
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Modals state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAllPackagesModal, setShowAllPackagesModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showCaraOrderModal, setShowCaraOrderModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formError, setFormError] = useState("");

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
  useEffect(() => {
    const fetchTestimonials = async () => {
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
    };

    fetchTestimonials();
  }, []);

  // 3. Fetch store settings from /api/settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.whatsapp_number) setWhatsappNumber(json.data.whatsapp_number);
          if (json.data.store_name) setStoreName(json.data.store_name);
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
      // Direct WhatsApp Order
      const invoiceNumber = `ZG-${Math.floor(100000 + Math.random() * 900000)}`;
      const message = `Halo Admin ${storeName}, saya ingin order via WhatsApp:%0A%0A` +
        `*No Invoice:* ${invoiceNumber}%0A` +
        `*Paket:* ${selectedPackage.amount} Robux%0A` +
        `*Total Bayar:* ${selectedPackage.priceFormatted}%0A` +
        `*Akun Roblox:* ${displayAccount}%0A` +
        `*Metode Order:* Via WhatsApp Admin%0A%0A` +
        `Mohon segera diproses ya kak. Terima kasih! 💖`;

      const cleanWa = whatsappNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${cleanWa}?text=${message}`, "_blank");
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
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-12 left-10 text-pink-300/40 text-4xl animate-float-slow">💖</div>
        <div className="absolute top-48 right-16 text-pink-300/40 text-3xl animate-sparkle">✨</div>
        <div className="absolute top-[40%] left-6 text-pink-300/40 text-2xl animate-float-slow">⭐</div>
        <div className="absolute top-[65%] right-10 text-pink-300/30 text-4xl animate-sparkle">🌸</div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-rose-200/35 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-[1240px] px-3 sm:px-6 py-4 flex flex-col gap-4 z-10">
        {/* Section 1: Navigation Bar */}
        <Navbar
          onOpenCaraOrder={() => setShowCaraOrderModal(true)}
          onOpenFaq={() => setShowFaqModal(true)}
        />

        {/* Section 2: Hero Section */}
        <HeroSection onOpenAllPackages={() => setShowAllPackagesModal(true)} />

        {/* Section 3: Main Product & Order Grid */}
        <section id="topup" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start relative z-20">
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
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start relative z-20">
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
          <PaymentFooter paymentMethods={PAYMENT_METHODS} />
        </div>
      </div>

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
    </div>
  );
}
