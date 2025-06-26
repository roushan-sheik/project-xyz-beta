"use client";
import React from "react";
import SubscriptionPlans from "@/components/payment/SubscriptionPlans";
import SubscriptionStatus from "@/components/payment/SubscriptionStatus";
import { ToastContainer } from "react-toastify";

const SubscriptionPage = () => {
  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <ToastContainer />
      <main className="py-8">
        <div className="container mx-auto">
          {/* Current Subscription Status */}
          <section className="mb-12">
            <SubscriptionStatus />
          </section>

          {/* Available Plans */}
          <section>
            <SubscriptionPlans />
          </section>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;
