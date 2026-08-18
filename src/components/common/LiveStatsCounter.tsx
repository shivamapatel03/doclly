import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface LiveStatsCounterProps {
  baseCount?: number;
}

export const LiveStatsCounter: React.FC<LiveStatsCounterProps> = ({ baseCount = 0 }) => {
  const [realCount, setRealCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      try {
        const { count, error } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true });
        if (!error && count !== null) {
          setRealCount(count);
        }
      } catch (err) {
        console.warn("Could not fetch live document count:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 15_000); // Poll every 15 seconds for live count
    return () => clearInterval(interval);
  }, []);

  const total = baseCount + realCount;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#6B7280]">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
      <span>
        <span className="font-bold text-[#111111]">{isLoading ? "..." : total.toLocaleString()}</span>
        {" "}{total === 1 ? "document" : "documents"} uploaded
      </span>
    </span>
  );
};
