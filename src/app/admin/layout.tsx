import React from "react";
import AdminBreadcrumbs from "@/components/AdminBreadcrumbs";
import { EventsProvider } from "@/app/context/EventsContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventsProvider>
      <div style={{ minHeight: '100vh', display: 'flex', marginTop: '60px', flexDirection: 'column' }}>
        <AdminBreadcrumbs />
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </EventsProvider>
  );
}
