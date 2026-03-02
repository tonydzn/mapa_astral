"use client";

import Link from "next/link";

const features = [
  { icon: "🌌", title: "Mapa Natal Completo", desc: "Posições planetárias precisas com casas astrológicas e aspectos", color: "#f59e0b" },
  { icon: "✨", title: "Interpretação Estelar", desc: "Análise profunda e detalhada das suas tendências e potenciais", color: "#8b5cf6" },
  { icon: "💑", title: "Sinastria Amorosa", desc: "Link viral de compatibilidade astrológica com seu parceiro(a)", color: "#f43f5e" },
  { icon: "🌕", title: "Mood Tracker Lunar", desc: "Registre seu humor e correlacione com as fases da Lua", color: "#c4b5fd" },
  { icon: "📄", title: "PDF Personalizado", desc: "Mapa natal em PDF bonito para baixar e guardar", color: "#10b981" },
  { icon: "🔮", title: "Trânsitos Mensais", desc: "Previsões personalizadas com base nos trânsitos planetários", color: "#67e8f9" },
];

const testimonials = [
  { name: "Ana Clara", sign: "♏ Escorpião", rating: 5, text: "A interpretação foi tão precisa que me deu arrepios. Nunca havia me visto tão claramente em palavras." },
  { name: "Lucas M.", sign: "♊ Gêmeos", rating: 5, text: "Fiz a sinastria com minha namorada. A compatibilidade e as análises foram simplesmente incríveis." },
  { name: "Fernanda R.", sign: "♓ Peixes", rating: 5, text: "O Mood Tracker me ajudou a entender meus ciclos emocionais de uma forma completamente nova." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen stars-bg" style={{ background: "#020617" }}>

      {/* Ambient blobs */}
      <div className="ambient" style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div className="blob" style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", top: -200, left: "15%", width: 600, height: 600, background: "radial-gradient(circle,rgba(139,92,246,.07),transparent)" }} />
        <div className="blob" style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", top: "40%", right: -100, width: 500, height: 500, background: "radial-gradient(circle,rgba(245,158,11,.05),transparent)" }} />
        <div className="blob" style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", bottom: 0, left: "30%", width: 400, height: 400, background: "radial-gradient(circle,rgba(244,63,94,.04),transparent)" }} />
      </div>

      {/* ===== HEADER ===== */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(2,6,23,.85)", backdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22, color: "#f59e0b", filter: "drop-shadow(0 0 12px rgba(245,158,11,.5))" }} className="animate-pulse-glow">✦</span>
            <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 18, letterSpacing: 3 }}>Mapa Astral</span>
          </div>
          <nav style={{ display: "flex", gap: 28, position: "absolute", left: "50%", transform: "translateX(-50%)" }} className="hidden md:flex">
            {[["#features", "Recursos"], ["#pricing", "Planos"], ["#testimonials", "Depoimentos"]].map(([href, label]) => (
              <a key={href} href={href} style={{ color: "#64748b", fontSize: 14, textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e2e8f0")} onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>{label}</a>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/login" className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>Entrar</Link>
            <Link href="/register" className="btn-gold" style={{ padding: "9px 18px", fontSize: 13 }}>Começar grátis →</Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section style={{ textAlign: "center", padding: "100px 24px 80px", position: "relative", zIndex: 1 }}>
        <div className="animate-float" style={{ fontSize: 64, marginBottom: 20, display: "inline-block", filter: "drop-shadow(0 0 30px rgba(245,158,11,.4))" }}>✦</div>

        <div className="badge-gold animate-slide-up" style={{ marginBottom: 20 }}>
          🌕 Lua Crescente · Sabedoria dos Astros
        </div>

        <h1 className="animate-slide-up" style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 24, animationDelay: ".1s" }}>
          Seu Mapa Astral<br />
          <span className="gradient-text">Personalizado e Completo</span>
        </h1>

        <p className="animate-slide-up" style={{ fontSize: "clamp(16px,2vw,20px)", color: "#94a3b8", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7, animationDelay: ".2s" }}>
          Descubra quem você veio ser. Mapa natal completo, sinastria amorosa e previsões personalizadas para sua jornada.
        </p>

        <div className="animate-slide-up" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animationDelay: ".3s" }}>
          <Link href="/register" className="btn-gold" style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }}>
            ✨ Criar meu mapa agora
          </Link>
          <a href="#features" className="btn-ghost" style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12 }}>
            Ver como funciona ↓
          </a>
        </div>
        <p style={{ color: "#334155", fontSize: 13, marginTop: 16 }}>Gratuito · 3 mapas sem cartão · Sem compromisso</p>

        {/* Stats */}
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
          {[["12k+", "Mapas gerados"], ["98%", "Satisfação"], ["< 30s", "Tempo de geração"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="gradient-text" style={{ fontSize: 30, fontWeight: 800 }}>{v}</div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="section-label">Recursos</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#fff", marginBottom: 14 }}>
              Tudo que você precisa para <span className="gradient-text-warm">se conhecer</span>
            </h2>
            <p style={{ color: "#64748b", maxWidth: 480, margin: "0 auto", fontSize: 15 }}>
              Astrologia moderna com interpretações profundas para revelar padrões, missões e talentos únicos
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: "24px", transition: "all .3s", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.borderColor = f.color + "40"; el.style.boxShadow = `0 20px 60px rgba(0,0,0,.3)`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.borderColor = ""; el.style.boxShadow = ""; }}>
                <div style={{ fontSize: 36, marginBottom: 14, filter: `drop-shadow(0 0 8px ${f.color}60)` }}>{f.icon}</div>
                <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={{ padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="section-label">Planos</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#fff" }}>
              Simples e <span className="gradient-text">transparente</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Free */}
            <div className="card" style={{ padding: "32px 28px" }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>GRATUITO</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: "#fff" }}>R$0</div>
                <div style={{ color: "#475569", fontSize: 13 }}>Para sempre</div>
              </div>
              <div style={{ borderTop: "1px solid #1a2540", paddingTop: 20, marginBottom: 24 }}>
                {[["✓", "3 mapas natais", "#22c55e"], ["✓", "Interpretação básica", "#22c55e"], ["✓", "Mood tracker", "#22c55e"], ["✓", "Compartilhamento", "#22c55e"], ["✗", "PDF personalizado", "#334155"], ["✗", "Sinastria", "#334155"], ["✗", "Interpretação Avançada", "#334155"]].map(([ic, tx, c], i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, fontSize: 14, color: c === "#22c55e" ? "#94a3b8" : "#2d3e5a" }}>
                    <span style={{ color: c, fontWeight: 700 }}>{ic}</span> {tx}
                  </div>
                ))}
              </div>
              <Link href="/register" className="btn-ghost" style={{ width: "100%", textAlign: "center", padding: 13, borderRadius: 10 }}>
                Começar grátis
              </Link>
            </div>

            {/* Premium */}
            <div className="card glow-gold" style={{ padding: "32px 28px", borderColor: "rgba(245,158,11,.3)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#f59e0b,#ec4899,#8b5cf6)" }} />
              <div style={{ position: "absolute", top: 14, right: 14 }} className="badge-gold">✨ Popular</div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ color: "#f59e0b", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>PREMIUM</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ fontSize: 42, fontWeight: 800, color: "#fff" }}>R$97</div>
                  <div style={{ color: "#475569", fontSize: 13, marginBottom: 10 }}>pagamento único</div>
                </div>
                <div style={{ color: "#475569", fontSize: 13 }}>Acesso <strong style={{ color: "#f59e0b" }}>vitalício</strong></div>
              </div>

              <div style={{ borderTop: "1px solid rgba(245,158,11,.2)", paddingTop: 20, marginBottom: 24 }}>
                {[["Mapas ilimitados"], ["Interpretação Avançada"], ["PDF personalizado"], ["Sinastria amorosa"], ["Previsões mensais"], ["Suporte prioritário"]].map(([tx], i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, fontSize: 14, color: "#cbd5e1" }}>
                    <span style={{ color: "#f59e0b" }}>✦</span> {tx}
                  </div>
                ))}
              </div>
              <Link href="/register" className="btn-gold" style={{ width: "100%", padding: 14, borderRadius: 10, fontSize: 15 }}>
                🚀 Ativar Premium
              </Link>
              <p style={{ textAlign: "center", fontSize: 12, color: "#475569", marginTop: 10 }}>Garantia de 7 dias · Pagamento via MP</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" style={{ padding: "80px 24px", position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,.04)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="section-label">Depoimentos</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#fff" }}>
              O cosmos fala por <span className="gradient-text">si mesmo</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} className="card" style={{ padding: 28 }}>
                <div style={{ color: "#f59e0b", fontSize: 16, letterSpacing: 2, marginBottom: 14 }}>{"★".repeat(t.rating)}</div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, fontStyle: "italic", marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ borderTop: "1px solid #1a2540", paddingTop: 16 }}>
                  <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: "#475569", fontSize: 12, marginTop: 3 }}>{t.sign}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section style={{ padding: "80px 24px 100px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 60, marginBottom: 20 }} className="animate-pulse-glow">🌌</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Pronto para se descobrir <span className="gradient-text">nos astros</span>?
          </h2>
          <p style={{ color: "#64748b", marginBottom: 32, fontSize: 16 }}>
            Comece agora, grátis. Seu mapa natal completo em menos de 30 segundos.
          </p>
          <Link href="/register" className="btn-gold" style={{ padding: "16px 48px", fontSize: 17, borderRadius: 14 }}>
            ✨ Criar meu mapa gratuitamente
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.04)", padding: "32px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ color: "#f59e0b", fontWeight: 800, letterSpacing: 3, marginBottom: 10 }}>✦ Mapa Astral</div>
        <p style={{ color: "#334155", fontSize: 13 }}>© 2025 Mapa Astral · Astrologia Moderna · Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
