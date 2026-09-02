"use client";

import React, { useState } from "react";
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

// Data & Types
import {
  ROBUX_PACKAGES,
  ALL_ROBUX_PACKAGES,
  TESTIMONIALS,
  PAYMENT_METHODS,
} from "@/data/landingData";
import { RobuxPackage, RobloxUser } from "@/types/landing";

export default function ZerlyGamersPage() {
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>(ROBUX_PACKAGES[2]); // Default 240 Robux
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

  const handleSelectPackage = (pkg: RobuxPackage) => {
    setSelectedPackage(pkg);
    setFormError("");
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
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
      const message = `Halo Admin Zerly Gamers, saya ingin order via WhatsApp:%0A%0A` +
        `*No Invoice:* ${invoiceNumber}%0A` +
        `*Paket:* ${selectedPackage.amount} Robux%0A` +
        `*Total Bayar:* ${selectedPackage.priceFormatted}%0A` +
        `*Akun Roblox:* ${displayAccount}%0A` +
        `*Metode Order:* Via WhatsApp Admin%0A%0A` +
        `Mohon segera diproses ya kak. Terima kasih! 💖`;

      window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
    } else {
      // Via Website: Open QRIS Checkout Modal
      setShowOrderModal(true);
    }
  };

  const handleConfirmOrder = (details: {
    whatsappNumber: string;
    notes: string;
    proofFile: File | null;
    proofUrl: string | null;
  }) => {
    setOrderSuccess(true);
    const invoiceNumber = `ZG-${Math.floor(100000 + Math.random() * 900000)}`;
    const displayAccount = robloxUser
      ? `${robloxUser.displayName} (@${robloxUser.name})`
      : userId;

    const message = `Halo Admin Zerly Gamers, saya telah upload bukti pembayaran di website:%0A%0A` +
      `*No Invoice:* ${invoiceNumber}%0A` +
      `*Paket:* ${selectedPackage.amount} Robux%0A` +
      `*Total Bayar:* ${selectedPackage.priceFormatted}%0A` +
      `*Akun Roblox:* ${displayAccount}%0A` +
      `*No. WhatsApp Pembeli:* ${details.whatsappNumber}%0A` +
      (details.notes ? `*Catatan:* ${details.notes}%0A` : "") +
      `*Metode Pembayaran:* QRIS Otomatis Website%0A%0A` +
      `Mohon segera dicek & dikirim Robux-nya ya kak. Terima kasih! 💖`;

    setTimeout(() => {
      window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
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
            packages={ROBUX_PACKAGES}
            selectedPackage={selectedPackage}
            onSelectPackage={handleSelectPackage}
            onOpenAllPackages={() => setShowAllPackagesModal(true)}
          />

          <FormOrder
            selectedPackage={selectedPackage}
            onSelectPackage={handleSelectPackage}
            allPackages={ALL_ROBUX_PACKAGES}
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

        {/* Section 4: Why Choose Us & Testimonials */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative z-20">
          <WhyChooseUs />
          <Testimonials
            testimonials={TESTIMONIALS}
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
        allPackages={ALL_ROBUX_PACKAGES}
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
