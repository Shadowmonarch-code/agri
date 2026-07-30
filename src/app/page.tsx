export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0 }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        background: 'white', borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #22c55e, #10b981)', color: 'white', fontWeight: 'bold', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>AgriVerse Academy</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="#departments" style={{ textDecoration: 'none', color: '#374151', fontSize: 14, fontWeight: 500 }}>Departments</a>
          <a href="#exams" style={{ textDecoration: 'none', color: '#374151', fontSize: 14, fontWeight: 500 }}>Exams</a>
          <button style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #22c55e', background: 'transparent', color: '#16a34a', fontWeight: 600, cursor: 'pointer' }}>Login</button>
          <button style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 100, paddingBottom: 60, padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 9999, background: '#dcfce7', color: '#15803d', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              India is Number 1 ICAR Learning Platform
            </div>
            <h1 style={{ fontSize: 52, lineHeight: 1.15, fontWeight: 800, color: '#111827', marginBottom: 20 }}>
              <span style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AgriVerse Academy</span>
              <br />
              <span style={{ fontSize: 32, color: '#374151' }}>Your Complete ICAR Education Ecosystem</span>
            </h1>
            <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.6, marginBottom: 28, maxWidth: 520 }}>
              Access premium study materials, previous year questions, mock tests, and video lectures for all ICAR disciplines.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button style={{ padding: '14px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Explore Materials</button>
              <button style={{ padding: '14px 28px', borderRadius: 10, border: '2px solid #e5e7eb', background: 'white', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>Take Mock Test</button>
            </div>
          </div>
          <div style={{ aspectRatio: 1, borderRadius: 24, background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 80 }}>🌾</div>
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>AgriVerse Academy</h2>
              <p style={{ color: '#6b7280' }}>India Largest ICAR Platform</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 32 }}>
                {[
                  { label: 'Students', value: '100K+' },
                  { label: 'Materials', value: '5000+' },
                  { label: 'Tests', value: '200+' },
                  { label: 'Success', value: '95%' }
                ].map((stat, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.8)', padding: 16, borderRadius: 12 }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { icon: '👨‍🎓', label: 'Students', value: '100,000+' },
            { icon: '📚', label: 'Materials', value: '5,000+' },
            { icon: '📖', label: 'Books', value: '1,000+' },
            { icon: '📝', label: 'Tests', value: '200+' },
            { icon: '🏛️', label: 'Universities', value: '50+' }
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, marginBottom: 48 }}>
          Everything You Need to <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg,#22c55e,#10b981)' }}>Succeed</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '📚', title: 'Study Material', desc: 'Books, notes, PYQs for all subjects' },
            { icon: '📝', title: 'PYQs', desc: '10 years solved papers' },
            { icon: '🎯', title: 'Mock Tests', desc: 'Exam pattern tests with timer' },
            { icon: '📹', title: 'Videos', desc: 'HD lectures by experts' },
            { icon: '🏆', title: 'Expert Notes', desc: 'From IIT/IISc professors' },
            { icon: '💬', title: 'Community', desc: 'Doubt resolution and mentorship' }
          ].map((f, i) => (
            <div key={i} style={{ padding: 28, borderRadius: 16, border: '1px solid #e5e7eb', background: 'white' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section id="departments" style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, marginBottom: 48 }}>
            Explore <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg,#22c55e,#10b981)' }}>ICAR Departments</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {['Agriculture', 'Horticulture', 'Forestry', 'Biotechnology', 'Agri Engg', 'Food Tech', 'Animal Sci', 'Fisheries', 'Pathology', 'Entomology', 'Soil Sci', 'Microbio'].map((dept, i) => (
              <a key={i} href="#" style={{ textDecoration: 'none', padding: 20, borderRadius: 12, background: 'white', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🌾</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{dept}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Exams */}
      <section id="exams" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, marginBottom: 48 }}>
            Competitive Exam <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg,#22c55e,#10b981)' }}>Preparation</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {['ICAR JRF', 'ICAR SRF', 'AIEEA UG', 'CSIR NET', 'GATE BT', 'CUET PG'].map((exam, i) => (
              <div key={i} style={{ padding: 28, borderRadius: 16, border: '1px solid #e5e7eb', background: 'white' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{exam}</h3>
                <p style={{ fontSize: 14, color: '#6b7280' }}>Duration: 3 Hours</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, background: 'linear-gradient(135deg, #22c55e, #16a34a)', padding: 64, textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 16 }}>Start Your ICAR Journey Today!</h2>
          <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 32 }}>Join 100,000+ students preparing with AgriVerse Academy.</p>
          <button style={{ padding: '14px 32px', borderRadius: 10, border: 'none', background: 'white', color: '#16a34a', fontWeight: 700, cursor: 'pointer' }}>Create Free Account</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111827', color: 'white', padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>AgriVerse Academy</div>
          <p style={{ opacity: 0.6, marginBottom: 32 }}>India largest ICAR learning platform.</p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, fontSize: 13, opacity: 0.5 }}>
            (c) 2024 AgriVerse Academy. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
