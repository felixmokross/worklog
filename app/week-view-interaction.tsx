"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useTransition,
} from "react";
import { TimePeriod, TimeSlot } from "./common/model";

const WeekViewInteractionContext = createContext<
  WeekViewInteractionContextValue | undefined
>(undefined);

type WeekViewInteractionContextValue = {
  dragBegin?: TimeSlot;
  setDragBegin: (value: TimeSlot | undefined) => void;
  dragEnd?: TimeSlot;
  setDragEnd: (value: TimeSlot | undefined) => void;
  dragDay?: number;
  setDragDay: (value: number | undefined) => void;
  isBusy: boolean;
  period?: TimePeriod;
  startTransition: (callback: () => void) => void;
  setIsMutating: (value: boolean) => void;
};

export function WeekViewInteractionProvider({ children }: PropsWithChildren) {
  // TODO a reducer would be better here
  const [dragBegin, setDragBegin] = useState<TimeSlot | undefined>(undefined);
  const [dragEnd, setDragEnd] = useState<TimeSlot | undefined>(undefined);
  const [dragDay, setDragDay] = useState<number | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [isMutating, setIsMutating] = useState(false);

  const isBusy = isPending || isMutating;
  const period = dragBegin && dragEnd && TimePeriod.from(dragBegin, dragEnd);
  return (
    <WeekViewInteractionContext.Provider
      value={{
        dragBegin,
        setDragBegin,
        dragEnd,
        setDragEnd,
        dragDay,
        setDragDay,
        isBusy,
        period,
        startTransition,
        setIsMutating,
      }}
    >
      {children}
    </WeekViewInteractionContext.Provider>
  );
}

export function useWeekViewInteraction() {
  const context = useContext(WeekViewInteractionContext);
  if (!context) {
    throw new Error(
      "useWeekViewInteraction must be used within a WeekViewInteractionProvider"
    );
  }
  return context;
}
