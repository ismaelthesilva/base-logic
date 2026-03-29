"use client";

import React, { useEffect } from "react";

// Extend Window interface for Hotmart
declare global {
  interface Window {
    checkoutElements?: {
      init: (type: string) => {
        mount: (selector: string) => void;
      };
    };
  }
}

const HotmartSalesFunnel = () => {
  useEffect(() => {
    // Create and load the Hotmart script
    const script = document.createElement("script");
    script.src =
      "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
    script.async = true;
    script.onload = () => {
      if (window.checkoutElements) {
        window.checkoutElements
          .init("salesFunnel")
          .mount("#hotmart-sales-funnel");
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <div id="hotmart-sales-funnel" className="mt-5"></div>;
};

export default HotmartSalesFunnel;
