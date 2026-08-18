import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface LiveStatsCounterProps {
  baseCount?: number;
}

export const LiveStatsCounter: React.FC<LiveStatsCounterProps> = ({ baseCount = 1850 }) => {
  const [realCount, setRealCount] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      try {
        const { count, error } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true });
        if (!error && count !== null) setRealCount(count);
      } catch {}
    };
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  const total = baseCount + realCount;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#6B7280]">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
      <span>
        <span className="font-semibold text-[#111111]">{total.toLocaleString()}+</span>
        {" "}documents uploaded
      </span>
    </span>
  );
};
