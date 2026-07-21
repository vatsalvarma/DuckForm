import { useEffect, useState } from 'react'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  over21: string
  dob: string
  howKnown: string
  aboutYourself: string
  artForms: string
  talent: string
  rating: number
  paymentMethod: string
  screenshot: File | null
  whatsappNumber: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  over21: '',
  dob: '',
  howKnown: '',
  aboutYourself: '',
  artForms: '',
  talent: '',
  rating: 0,
  paymentMethod: 'upi',
  screenshot: null,
  whatsappNumber: '',
}

const vibeCards = [
  {
    title: 'Come as you are',
    body: 'Strangers walk in, friends walk out. No cliques, no dress code, no cover-band small talk.',
  },
  {
    title: 'Games & chaos',
    body: 'Icebreakers that actually break ice. Expect mild competition and zero dignity.',
  },
  {
    title: 'Food & yapping',
    body: 'Snacks on the table, conversations everywhere else. Stay an hour or stay till the end.',
  },
]

function AdminPanel({ onBack }: { onBack: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [leads, setLeads] = useState<any[]>([])
  const [selectedLead, setSelectedLead] = useState<any | null>(null)

  useEffect(() => {
    setLeads(JSON.parse(localStorage.getItem('wtd_leads') || '[]'))
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '4rem 1.5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '2.5rem', marginBottom: '2rem' }}>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', border: '4px solid var(--ink)', width: '100%', maxWidth: '400px', boxShadow: '8px 8px 0 var(--teal)' }}>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (admin123)" style={{ width: '100%', padding: '1rem', border: '3px solid var(--ink)', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '1.1rem' }} />
          <button type="submit" className="submit-btn">Login</button>
          <button type="button" onClick={onBack} style={{ marginTop: '1.5rem', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem', fontWeight: 600 }}>&larr; Back to Site</button>
        </form>
      </div>
    )
  }

  if (selectedLead) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => setSelectedLead(null)} className="submit-btn" style={{ width: 'auto', padding: '0.8rem 1.5rem', marginBottom: '2rem' }}>&larr; Back to Leads</button>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>Lead: {selectedLead.id}</h2>
        <div style={{ background: '#fff', border: '4px solid var(--ink)', borderRadius: '20px', padding: '2.5rem', boxShadow: '8px 8px 0 var(--yellow)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '1.1rem', marginBottom: '2rem' }}>
            <p><strong>Name:</strong> {selectedLead.firstName} {selectedLead.lastName}</p>
            <p><strong>Email:</strong> {selectedLead.email}</p>
            <p><strong>Phone:</strong> {selectedLead.phone}</p>
            <p><strong>Over 21:</strong> {selectedLead.over21}</p>
            {selectedLead.over21 === 'Yes' && (
              <>
                <p><strong>DOB:</strong> {selectedLead.dob}</p>
                <p><strong>How Known:</strong> {selectedLead.howKnown}</p>
                <p><strong>About:</strong> {selectedLead.aboutYourself}</p>
                <p><strong>Art Forms:</strong> {selectedLead.artForms}</p>
                {selectedLead.talent && <p><strong>Talent:</strong> {selectedLead.talent}</p>}
              </>
            )}
            <p><strong>Rating:</strong> {selectedLead.rating} / 5</p>
            <p><strong>Payment Method:</strong> {selectedLead.paymentMethod}</p>
          </div>
          {selectedLead.screenshotBase64 && (
            <div style={{ marginTop: '1.5rem', borderTop: '2px dashed #ccc', paddingTop: '1.5rem' }}>
              <strong style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem' }}>Payment Screenshot:</strong>
              <img src={selectedLead.screenshotBase64} alt="Screenshot" style={{ display: 'block', maxWidth: '100%', maxHeight: '500px', border: '4px solid var(--ink)', borderRadius: '12px', marginBottom: '1.5rem' }} />

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button 
                  onClick={() => {
                    const updated = leads.map(l => l.id === selectedLead.id ? { ...l, status: 'Approved' } : l)
                    setLeads(updated)
                    localStorage.setItem('wtd_leads', JSON.stringify(updated))
                    setSelectedLead({ ...selectedLead, status: 'Approved' })
                  }}
                  style={{ flex: 1, padding: '0.8rem', background: selectedLead.status === 'Approved' ? 'var(--teal)' : '#eee', color: selectedLead.status === 'Approved' ? '#fff' : 'var(--ink)', border: '2px solid var(--ink)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Approve
                </button>
                <button 
                  onClick={() => {
                    const updated = leads.map(l => l.id === selectedLead.id ? { ...l, status: 'Rejected' } : l)
                    setLeads(updated)
                    localStorage.setItem('wtd_leads', JSON.stringify(updated))
                    setSelectedLead({ ...selectedLead, status: 'Rejected' })
                  }}
                  style={{ flex: 1, padding: '0.8rem', background: selectedLead.status === 'Rejected' ? 'var(--pink)' : '#eee', color: selectedLead.status === 'Rejected' ? '#fff' : 'var(--ink)', border: '2px solid var(--ink)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Reject
                </button>
              </div>

              {selectedLead.status === 'Approved' && selectedLead.whatsappNumber && (
                <button
                  onClick={() => {
                    const message = encodeURIComponent(`Quack quack! 🦆\n\nYour payment is approved and your WhozTheDuck ticket is confirmed!\n\nName: ${selectedLead.firstName} ${selectedLead.lastName}\nTicket ID: ${selectedLead.id}\n\nSee you at the flock!`);
                    window.open(`https://wa.me/${selectedLead.whatsappNumber.replace(/\D/g,'')}?text=${message}`, '_blank');
                  }}
                  style={{ width: '100%', padding: '1rem', background: '#25D366', color: '#fff', border: '3px solid var(--ink)', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                  </svg>
                  Send Ticket on WhatsApp
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '3rem' }}>Dashboard 🦆</h2>
        <button onClick={onBack} className="submit-btn" style={{ width: 'auto', padding: '0.8rem 2rem', background: '#eee' }}>Exit</button>
      </div>
      
      {leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', border: '4px solid var(--ink)', borderRadius: '20px' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>No leads yet. They will appear here!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.2rem' }}>
          {leads.slice().reverse().map(lead => (
            <div key={lead.id} onClick={() => setSelectedLead(lead)} style={{ background: '#fff', border: '3px solid var(--ink)', borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s' }} className="lead-card">
              <div>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', fontFamily: 'var(--display)' }}>{lead.firstName} {lead.lastName}</h4>
                <p style={{ opacity: 0.7, fontWeight: 600 }}>{new Date(lead.timestamp).toLocaleString()} • {lead.id}</p>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--pink)', fontSize: '1.1rem' }}>View Details &rarr;</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function App() {
  const [view, setView] = useState<'home' | 'admin'>(() => window.location.search.includes('admin=true') ? 'admin' : 'home')
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(1)
  const [ticketId, setTicketId] = useState('')

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const validateStep1 = () => {
    const nextErrors: FormErrors = {}
    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required.'
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = 'That email doesn\'t look right.'
    if (!form.phone.trim()) nextErrors.phone = 'Contact number is required.'
    if (!form.over21) nextErrors.over21 = 'Please select an option.'
    return nextErrors
  }

  const validateStep2 = () => {
    const nextErrors: FormErrors = {}
    if (!form.dob) nextErrors.dob = 'Date of birth is required.'
    if (!form.howKnown.trim()) nextErrors.howKnown = 'Please tell us how you found out.'
    if (!form.aboutYourself.trim()) nextErrors.aboutYourself = 'Please tell us a bit about yourself.'
    if (!form.artForms) nextErrors.artForms = 'Please select an option.'
    return nextErrors
  }

  const validateStep3 = () => {
    const nextErrors: FormErrors = {}
    if (!form.talent.trim()) nextErrors.talent = 'Please let us know your talent.'
    return nextErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name as keyof FormState]: undefined }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm(prev => ({ ...prev, screenshot: e.target.files![0] }))
      setErrors(prev => ({ ...prev, screenshot: undefined }))
    }
  }

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateStep1()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorField = document.querySelector<HTMLElement>('[data-error-field]')
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    
    if (form.over21 === 'Yes') {
      setStep(2)
    } else {
      setStep(4)
    }
  }

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateStep2()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorField = document.querySelector<HTMLElement>('[data-error-field]')
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    
    if (form.artForms === 'Yes' || form.artForms === 'Would love to try!') {
      setStep(3)
    } else {
      setStep(4)
    }
  }

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateStep3()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorField = document.querySelector<HTMLElement>('[data-error-field]')
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    
    setStep(4)
  }

  const validateStep4 = () => {
    const nextErrors: FormErrors = {}
    if (form.rating === 0) nextErrors.rating = 'Please leave a rating' as any
    return nextErrors
  }

  const handleNextStep4 = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateStep4()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorField = document.querySelector<HTMLElement>('[data-error-field]')
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    
    setStep(5)
  }

  const validateStep5 = () => {
    const nextErrors: FormErrors = {}
    if (!form.screenshot) nextErrors.screenshot = 'Please attach the payment screenshot.' as any
    return nextErrors
  }

  const handleNextStep5 = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateStep5()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorField = document.querySelector<HTMLElement>('[data-error-field]')
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setStep(6)
  }

  const validateStep6 = () => {
    const nextErrors: FormErrors = {}
    if (!form.whatsappNumber.trim() || form.whatsappNumber.length < 10) nextErrors.whatsappNumber = 'Please enter a valid WhatsApp number.' as any
    return nextErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validateStep6()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorField = document.querySelector<HTMLElement>('[data-error-field]')
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    try {
      let screenshotBase64 = null
      if (form.screenshot) {
        screenshotBase64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(form.screenshot as Blob)
        })
      }

      const generatedId = 'WTD-' + Math.random().toString(36).substring(2, 8).toUpperCase()
      
      const newLead = {
        ...form,
        id: generatedId,
        timestamp: Date.now(),
        screenshotBase64,
        screenshot: undefined 
      }
      
      const existingLeads = JSON.parse(localStorage.getItem('wtd_leads') || '[]')
      existingLeads.push(newLead)
      localStorage.setItem('wtd_leads', JSON.stringify(existingLeads))

      const data = new FormData()
      data.append('firstName', form.firstName)
      data.append('lastName', form.lastName)
      data.append('email', form.email)
      data.append('phone', form.phone)
      data.append('over21', form.over21)
      if (form.over21 === 'Yes') {
        data.append('dob', form.dob)
        data.append('howKnown', form.howKnown)
        data.append('aboutYourself', form.aboutYourself)
        data.append('artForms', form.artForms)
        if (form.artForms === 'Yes' || form.artForms === 'Would love to try!') {
          data.append('talent', form.talent)
        }
      }
      data.append('rating', String(form.rating))
      if (form.screenshot) data.append('screenshot', form.screenshot)
      data.append('paymentMethod', form.paymentMethod)
      data.append('whatsappNumber', form.whatsappNumber)
      data.append('_subject', 'New WhozTheDuck signup')
      data.append('_captcha', 'false')
      data.append('_template', 'table')

      fetch('https://formsubmit.co/gamesvatsal99@gmail.com', {
        method: 'POST',
        body: data,
      }).catch(err => console.error(err)) // silent catch

      setTicketId(generatedId)
      setSubmitted(true)
      setStep(7)
    } catch (e) {
      console.error(e)
      setSubmitted(true)
      setStep(7)
    }
  }

  if (view === 'admin') {
    return <AdminPanel onBack={() => setView('home')} />
  }

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="duck" viewBox="0 0 100 100">
          <ellipse cx="46" cy="66" rx="34" ry="24" fill="#FFCE5C" stroke="#241F1C" strokeWidth="4" />
          <circle cx="66" cy="38" r="20" fill="#FFCE5C" stroke="#241F1C" strokeWidth="4" />
          <path d="M84 36 Q98 38 86 46 Q80 48 82 42 Z" fill="#FF8A3D" stroke="#241F1C" strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="70" cy="33" r="3.4" fill="#241F1C" />
          <path d="M26 60 Q14 66 22 74" fill="none" stroke="#241F1C" strokeWidth="4" strokeLinecap="round" />
        </symbol>
        <symbol id="squig" viewBox="0 0 200 20" preserveAspectRatio="none">
          <path d="M0 10 Q12.5 0 25 10 T50 10 T75 10 T100 10 T125 10 T150 10 T175 10 T200 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </symbol>
      </svg>

      <header className="hero">
        <svg className="shape f" style={{ '--r': '12deg', top: '12%', left: '6%', width: '46px', height: '46px', color: 'var(--pink)' } as React.CSSProperties} viewBox="0 0 40 40">
          <polygon points="20,2 38,38 2,38" fill="none" stroke="currentColor" strokeWidth="5" />
        </svg>
        <svg className="shape f" style={{ '--r': '-8deg', top: '22%', right: '8%', width: '52px', height: '52px', color: 'var(--teal)', animationDelay: '.7s' } as React.CSSProperties} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="6 7" />
        </svg>
        <svg className="shape f" style={{ '--r': '6deg', bottom: '16%', left: '10%', width: '80px', height: '14px', color: 'var(--purple)', animationDelay: '1.2s' } as React.CSSProperties} viewBox="0 0 200 20">
          <use href="#squig" />
        </svg>
        <svg className="shape f" style={{ '--r': '-14deg', bottom: '22%', right: '12%', width: '40px', height: '40px', color: 'var(--beak)', animationDelay: '.4s' } as React.CSSProperties} viewBox="0 0 40 40">
          <rect x="6" y="6" width="28" height="28" fill="currentColor" rx="4" />
        </svg>

        <span className="hero-badge">A social gathering · not a show</span>
        <h1>
          Whoz<svg className="duck-inline" aria-hidden="true"><use href="#duck" /></svg>The<br />Duck
        </h1>
        <div className="edition"> 3.0 </div>
        <p className="hero-sub">No stage. No pressure. Just good people, loud laughs, and one very confident duck. Pull up, mingle, belong.</p>
        <a className="hero-cta" href="#join">Join the flock ↓</a>
      </header>

      <svg className="squiggle-div" style={{ color: 'var(--pink)' }} viewBox="0 0 200 20" preserveAspectRatio="none"><use href="#squig" /></svg>

      <section>
        <div className="wrap">
          <h2 className="sec-title reveal">What&apos;s the quack about?</h2>
          <p className="sec-sub reveal">Five editions in, the rules haven&apos;t changed:</p>
          <div className="vibes">
            {vibeCards.map((card) => (
              <div className="vibe reveal" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="join-section">
        <div className="wrap">
          <div className="form-card reveal">
            <svg className="form-duck" aria-hidden="true"><use href="#duck" /></svg>
            <h2 className="sec-title">Quack in</h2>
            <p className="sec-sub" style={{ marginBottom: '1.8rem' }}>Drop your details — we&apos;ll keep you posted on Edition 5.</p>

            {!submitted ? (
              step === 1 ? (
              <form onSubmit={handleNextStep1} noValidate>
                <div className={`field ${errors.firstName ? 'bad' : ''}`} data-error-field={errors.firstName ? true : undefined}>
                  <label className="f-label" htmlFor="firstName">First Name <small>*</small></label>
                  <input type="text" id="firstName" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
                  {errors.firstName && <p className="err">{errors.firstName}</p>}
                </div>

                <div className={`field ${errors.lastName ? 'bad' : ''}`} data-error-field={errors.lastName ? true : undefined}>
                  <label className="f-label" htmlFor="lastName">Last Name <small>*</small></label>
                  <input type="text" id="lastName" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
                  {errors.lastName && <p className="err">{errors.lastName}</p>}
                </div>

                <div className={`field ${errors.email ? 'bad' : ''}`} data-error-field={errors.email ? true : undefined}>
                  <label className="f-label" htmlFor="email">Email Address <small>*</small></label>
                  <input type="email" id="email" name="email" placeholder="you@somewhere.com" value={form.email} onChange={handleChange} />
                  {errors.email && <p className="err">{errors.email}</p>}
                </div>

                <div className={`field ${errors.phone ? 'bad' : ''}`} data-error-field={errors.phone ? true : undefined}>
                  <label className="f-label" htmlFor="phone">Contact number <small>*</small></label>
                  <input type="tel" id="phone" name="phone" placeholder="+91 96868 74348" value={form.phone} onChange={handleChange} />
                  {errors.phone && <p className="err">{errors.phone}</p>}
                </div>

                <div className={`field ${errors.over21 ? 'bad' : ''}`} data-error-field={errors.over21 ? true : undefined}>
                  <label className="f-label">Are you above 21+? <small>*</small></label>
                  <div className="radio-group" style={{ display: 'flex', gap: '1.5rem', marginTop: '0.8rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input type="radio" name="over21" value="Yes" checked={form.over21 === 'Yes'} onChange={handleChange} />
                      A Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input type="radio" name="over21" value="No" checked={form.over21 === 'No'} onChange={handleChange} />
                      B No
                    </label>
                  </div>
                  {errors.over21 && <p className="err">{errors.over21}</p>}
                </div>

                {form.over21 === 'No' ? (
                  <div className="locked-btn-wrapper">
                    <button type="button" className="submit-btn locked-btn" disabled>
                      Next
                    </button>
                    <p className="locked-msg">Sorry, you must be 21+ to join the flock!</p>
                  </div>
                ) : (
                  <button type="submit" className="submit-btn">Next</button>
                )}
              </form>
              ) : step === 2 ? (
                <form onSubmit={handleNextStep2} noValidate>
                  <div className={`field ${errors.dob ? 'bad' : ''}`} data-error-field={errors.dob ? true : undefined}>
                    <label className="f-label" htmlFor="dob">Date of birth? <small>*</small></label>
                    <input type="date" id="dob" name="dob" max="2012-12-31" value={form.dob} onChange={handleChange} />
                    {errors.dob && <p className="err">{errors.dob}</p>}
                  </div>

                  <div className={`field ${errors.howKnown ? 'bad' : ''}`} data-error-field={errors.howKnown ? true : undefined}>
                    <label className="f-label" htmlFor="howKnown">How you got to know about us? <small>*</small></label>
                    <input type="text" id="howKnown" name="howKnown" placeholder="Instagram, a friend..." value={form.howKnown} onChange={handleChange} />
                    {errors.howKnown && <p className="err">{errors.howKnown}</p>}
                  </div>

                  <div className={`field ${errors.aboutYourself ? 'bad' : ''}`} data-error-field={errors.aboutYourself ? true : undefined}>
                    <label className="f-label" htmlFor="aboutYourself">Tell us a bit more about yourself. <small>*</small></label>
                    <textarea id="aboutYourself" name="aboutYourself" placeholder="I like painting and feeding ducks..." value={form.aboutYourself} onChange={handleChange} />
                    {errors.aboutYourself && <p className="err">{errors.aboutYourself}</p>}
                  </div>

                  <div className={`field ${errors.artForms ? 'bad' : ''}`} data-error-field={errors.artForms ? true : undefined}>
                    <label className="f-label">Are you interested in any of the art forms? <small>*</small></label>
                    <div className="radio-group" style={{ display: 'flex', gap: '1.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                        <input type="radio" name="artForms" value="Yes" checked={form.artForms === 'Yes'} onChange={handleChange} />
                        A Yes
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                        <input type="radio" name="artForms" value="No" checked={form.artForms === 'No'} onChange={handleChange} />
                        B No
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                        <input type="radio" name="artForms" value="Would love to try!" checked={form.artForms === 'Would love to try!'} onChange={handleChange} />
                        C Would love to try!
                      </label>
                    </div>
                    {errors.artForms && <p className="err">{errors.artForms}</p>}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="submit-btn" style={{ background: '#eee', color: 'var(--ink)' }} onClick={() => setStep(1)}>Back</button>
                    <button type="submit" className="submit-btn">Next</button>
                  </div>
                </form>
              ) : step === 3 ? (
                <form onSubmit={handleNextStep3} noValidate>
                  <div className={`field ${errors.talent ? 'bad' : ''}`} data-error-field={errors.talent ? true : undefined}>
                    <label className="f-label" htmlFor="talent">Please let us know the respective talent you are interested in! <small>*</small></label>
                    <textarea id="talent" name="talent" placeholder="E.g. Singing, dancing, comedy..." value={form.talent} onChange={handleChange} />
                    {errors.talent && <p className="err">{errors.talent}</p>}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="submit-btn" style={{ background: '#eee', color: 'var(--ink)' }} onClick={() => setStep(2)}>Back</button>
                    <button type="submit" className="submit-btn">Next</button>
                  </div>
                </form>
              ) : step === 4 ? (
                <form onSubmit={handleNextStep4} noValidate>
                  <div className={`field ${errors.rating ? 'bad' : ''}`} data-error-field={errors.rating ? true : undefined}>
                    <label className="f-label" style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '1rem' }}>How would you rate this?</label>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        {form.rating > 0 ? (
                          <img 
                            key={form.rating}
                            src={`${import.meta.env.BASE_URL}${form.rating}star.png`} 
                            alt={`${form.rating} star duck`}
                            className="duck-rating-img"
                          />
                        ) : (
                          <div style={{ height: '100px', width: '100px', opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg className="duck-inline" aria-hidden="true" style={{ width: '60px', height: '60px' }}><use href="#duck" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="stars-container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '3.5rem', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            onClick={() => { setForm(prev => ({ ...prev, rating: star })); setErrors(prev => ({ ...prev, rating: undefined })); }}
                            className={`star ${form.rating >= star ? 'active' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {errors.rating && <p className="err" style={{ textAlign: 'center', marginTop: '1rem' }}>{errors.rating}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="submit-btn" style={{ background: '#eee', color: 'var(--ink)' }} onClick={() => {
                      if (form.over21 === 'Yes') {
                        if (form.artForms === 'Yes' || form.artForms === 'Would love to try!') {
                          setStep(3)
                        } else {
                          setStep(2)
                        }
                      } else {
                        setStep(1)
                      }
                    }}>Back</button>
                    <button type="submit" className="submit-btn">Next</button>
                  </div>
                </form>
              ) : step === 5 ? (
                <form onSubmit={handleNextStep5} noValidate>
                  <h3 className="sec-title" style={{ fontSize: '1.6rem', textAlign: 'center' }}>Secure Payment</h3>
                  <div className="payment-options">
                    <div className="pay-option locked">
                      <span>Credit Card</span>
                      <span>🔒</span>
                    </div>
                    <div className="pay-option locked">
                      <span>Net Banking</span>
                      <span>🔒</span>
                    </div>
                    <div className="pay-option active">
                      <span>UPI</span>
                      <span>✅</span>
                    </div>
                  </div>

                  <div className="qr-container">
                    <p style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--pink)' }}>Scan to Pay</p>
                    <div className="qr-box">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=admin@duck&pn=WhozTheDuck" alt="UPI QR Code" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                    </div>
                  </div>

                  <div className={`field ${errors.screenshot ? 'bad' : ''}`} data-error-field={errors.screenshot ? true : undefined} style={{ marginTop: '1.5rem' }}>
                    <label className="f-label" htmlFor="screenshot">Attach Payment Screenshot <small>*</small></label>
                    <input type="file" id="screenshot" accept="image/*" onChange={handleFileChange} style={{ background: '#fff', padding: '0.6rem' }} />
                    {errors.screenshot && <p className="err">{errors.screenshot}</p>}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="submit-btn" style={{ background: '#eee', color: 'var(--ink)' }} onClick={() => setStep(4)}>Back</button>
                    <button type="submit" className="submit-btn">Next</button>
                  </div>
                </form>
              ) : step === 6 ? (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className="sec-title" style={{ fontSize: '1.6rem', textAlign: 'center' }}>Where should we send your ticket?</h3>
                  <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600, opacity: 0.8 }}>Your golden ticket will be sent to your WhatsApp once approved by our team.</p>
                  
                  <div className={`field ${errors.whatsappNumber ? 'bad' : ''}`} data-error-field={errors.whatsappNumber ? true : undefined}>
                    <label className="f-label" htmlFor="whatsappNumber">WhatsApp Number <small>*</small></label>
                    <input type="tel" id="whatsappNumber" name="whatsappNumber" placeholder="+91 96868 74348" value={form.whatsappNumber} onChange={handleChange} />
                    {errors.whatsappNumber && <p className="err">{errors.whatsappNumber}</p>}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="submit-btn" style={{ background: '#eee', color: 'var(--ink)' }} onClick={() => setStep(5)}>Back</button>
                    <button type="submit" className="submit-btn">Complete Registration</button>
                  </div>
                </form>
              ) : null
            ) : (
              <div className="done show">
                <svg className="duck-inline" aria-hidden="true" style={{ width: '80px', height: '80px', marginBottom: '1.5rem', animation: 'bob 2s infinite' }}><use href="#duck" /></svg>
                <h3 className="sec-title" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Quack-tastic! 🦆</h3>
                <p style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 600, marginTop: '1rem', lineHeight: 1.5 }}>
                  We have received your payment screenshot.<br/><br/>
                  Our team is reviewing it. Once approved, your golden ticket will be sent directly to your WhatsApp!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer>
        <svg className="shape f" style={{ '--r': '8deg', top: '20%', left: '8%', width: '60px', height: '12px', color: 'var(--pink)' } as React.CSSProperties} viewBox="0 0 200 20"><use href="#squig" /></svg>
        <svg className="shape f" style={{ '--r': '-10deg', top: '30%', right: '10%', width: '34px', height: '34px', color: 'var(--teal)', animationDelay: '.8s' } as React.CSSProperties} viewBox="0 0 40 40"><polygon points="20,2 38,38 2,38" fill="none" stroke="currentColor" strokeWidth="5" /></svg>
        <p className="follow-label">Follow the duck</p>
        <a className="handle" href="https://instagram.com/whzthemic" target="_blank" rel="noreferrer">@whzthemic</a>
        <p className="foot-note">WhozTheDuck · Edition 5 · Hyderabad</p>
        <div style={{ marginTop: '1.5rem' }}>
          <button onClick={() => setView('admin')} style={{ background: 'transparent', border: 'none', color: 'var(--paper)', opacity: 0.2, cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>Admin Login</button>
        </div>
      </footer>

      <a 
        href="https://wa.me/919686874348" 
        target="_blank" 
        rel="noreferrer"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          backgroundColor: '#25D366',
          color: 'white',
          borderRadius: '999px',
          padding: '0.8rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none',
          fontWeight: 700,
          fontFamily: 'var(--display)',
          fontSize: '1.2rem',
          boxShadow: '4px 4px 0 var(--ink)',
          border: '3px solid var(--ink)',
          zIndex: 99999,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Support
      </a>
    </>
  )
}

export default App
