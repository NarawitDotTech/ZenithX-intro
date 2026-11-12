"use client";

import dynamic from "next/dynamic";

// The admin reads the saved token from browser storage, so it renders in the browser only.
export const AdminClient = dynamic(() => import("./AdminApp").then((m) => m.AdminApp), {
  ssr: false,
  loading: () => (
    <p className="py-24 text-center text-muted" role="status">
      Loading admin…
    </p>
  ),
});
