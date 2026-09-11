"use client";

// Loader do mini modal de contato. Monta no 1º "contact-detail:open".

import dynamic from "next/dynamic";
import DeferredEventMount from "@/components/lazy/DeferredEventMount";
import { CONTACT_DETAIL_EVENT } from "@/lib/contact-detail";

const ContactDetailModal = dynamic(
  () => import("@/components/parceiros/ContactDetailModal"),
  { ssr: false },
);

export default function ContactDetailModalLazy() {
  return (
    <DeferredEventMount event={CONTACT_DETAIL_EVENT}>
      {() => <ContactDetailModal />}
    </DeferredEventMount>
  );
}
