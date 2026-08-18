"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { notificationService } from "@/services/notification.service";
import { useAuth } from "@/hooks/useAuth";
import type { Notification } from "@/types";
import { timeAgo } from "@/lib/format";
import { popTransition } from "@/lib/motion";

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  async function load() {
    if (!user) return;
    const res = await notificationService.list({ limit: 6 });
    setItems(res.data.items);
    setUnread(res.data.unread);
  }

  useEffect(() => {
    load().catch(() => undefined);
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-transparent text-foreground transition duration-300 ease-smooth hover:scale-105 hover:border-border hover:bg-muted hover:shadow-soft active:scale-95"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={18} />
        {unread > 0 ? (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        ) : null}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="notifications"
            className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-3xl border border-border bg-card p-3 shadow-lift"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={popTransition}
          >
          <div className="mb-2 flex items-center justify-between px-2">
            <p className="text-sm font-medium text-foreground">Notifications</p>
            <button
              className="text-xs text-primary hover:text-primary-strong"
              onClick={() => notificationService.readAll().then(load)}
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 space-y-1 overflow-auto">
            {items.length === 0 ? (
              <p className="px-2 py-6 text-sm text-muted-foreground">You are all caught up.</p>
            ) : null}
            {items.map((item) => (
              <Link
                key={item._id}
                href={item.link || "#"}
                onClick={() => {
                  notificationService.read(item._id).then(load);
                  setOpen(false);
                }}
                className="block rounded-2xl px-3 py-2 text-foreground transition duration-300 hover:bg-muted"
              >
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.message}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(item.createdAt)}</p>
              </Link>
            ))}
          </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
