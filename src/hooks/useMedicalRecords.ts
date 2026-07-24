"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadRecords,
  saveRecords,
  sortRecordsByDate,
  type MedicalRecord,
} from "@/lib/medicalRecords";

export function useMedicalRecords(clientId: string | undefined) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!clientId) {
      setRecords([]);
      setReady(true);
      return;
    }
    setRecords(sortRecordsByDate(loadRecords(clientId)));
    setReady(true);
  }, [clientId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!clientId) return;
      if (e.key === `caseflow.medicalRecords.${clientId}`) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [clientId, refresh]);

  const replaceAll = useCallback(
    (next: MedicalRecord[]) => {
      if (!clientId) return;
      saveRecords(clientId, next);
      setRecords(sortRecordsByDate(next));
    },
    [clientId],
  );

  return { records, ready, refresh, replaceAll };
}
