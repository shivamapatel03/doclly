import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const AuthCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handle = async () => {
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            setStatus("error");
          } else if (data.session) {
            setStatus("success");
          } else {
            setStatus("error");
          }
        }
      } finally {
        setTimeout(() => {
          if (window.opener && !window.opener.closed) {
            window.close();
          } else {
            window.location.replace("/dashboard");
          }
        }, 800);
      }
    };
    handle();
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"system-ui, sans-serif", background:"#f9f9f9", gap:"16px" }}>
      {status === "loading" && (
        <>
          <div style={{ width:40, height:40, border:"3px solid #e5e5e5", borderTop:"3px solid #FFC800", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color:"#555", fontSize:14 }}>Completing Google sign-in...</p>
        </>
      )}
      {status === "success" && <p style={{ color:"#16a34a", fontSize:14, fontWeight:600 }}>Signed in! Closing window...</p>}
      {status === "error" && <p style={{ color:"#dc2626", fontSize:14 }}>Sign-in failed. Please close this window and try again.</p>}
    </div>
  );
};
