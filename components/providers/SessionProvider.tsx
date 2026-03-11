"use client";

import { createContext, useContext } from "react";

import type { Session } from "@/lib/authentication";
import type { NotificationDataType } from "@/types/notifications";

const SessionContext = createContext<
  { session: Session | null; notifications: NotificationDataType[] } | undefined
>(undefined);

export const SessionProvider: React.FC<{
  children: React.ReactNode;
  session: Session | null;
  notifications: NotificationDataType[];
}> = ({ children, session, notifications }) => {
  return (
    <SessionContext.Provider value={{ session, notifications }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context.session;
};

export const useNotifications = () => {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useNotifications must be used within a SessionProvider");
  }

  
  return context.notifications;
};
