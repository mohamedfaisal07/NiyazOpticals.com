import React, { useState } from 'react';
import { useApp } from './AppContext';
import { MapPin, Phone, MessageSquare, Clock, ShieldCheck, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { staggerReveal, fadeUp, springEase, viewportOnce } from '../utils/animations';
import { CinematicBackground } from './CinematicBackground';
import { submitAppointment } from '../lib/appointments';
import { submitContactMessage } from '../lib/contactMessages';
import { useCanHover } from '../hooks/useCanHover';

export const LocationSection: React.FC = () => {
  const { addAppointment } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();

  // Booking fields state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interestedIn: 'Computer Glasses Upgrade',
    type: 'Store Visit' as 'Store Visit' | 'Home Eye Test',
    message: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [messageSubmitting, setMessageSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);

    if (!formData.name.trim() || !formData.phone.trim()) {
      setBookingError('Please enter your name and phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const savedAppointment = await submitAppointment({
        customer_name: formData.name,
        phone: formData.phone,
        appointment_type: formData.type,
        interest: formData.interestedIn,
        message: formData.message,
      });

      addAppointment({
        name: savedAppointment.name,
        phone: savedAppointment.phone,
        date: savedAppointment.date,
        slot: savedAppointment.slot,
        type: savedAppointment.type,
        interestedIn: savedAppointment.interestedIn,
        message: savedAppointment.message,
      });
      setBookingSuccess(true);
      setFormData({
        name: '',
        phone: '',
        interestedIn: 'Computer Glasses Upgrade',
        type: 'Store Visit',
        message: ''
      });

      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Could not save your appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessageError('');
    setMessageSuccess(false);

    if (
      !contactForm.name.trim() ||
      !contactForm.phone.trim() ||
      !contactForm.subject.trim() ||
      !contactForm.message.trim()
    ) {
      setMessageError('Please fill name, phone, subject, and message.');
      return;
    }

    setMessageSubmitting(true);

    try {
      await submitContactMessage(contactForm);
      setMessageSuccess(true);
      setContactForm({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setMessageSuccess(false), 5000);
    } catch (error) {
      setMessageError(error instanceof Error ? error.message : 'Could not send your message. Please try again.');
    } finally {
      setMessageSubmitting(false);
    }
  };

  const contactNumbers = [
    { label: "Primary Support", num: "9443617786" },
    { label: "Secondary Hotline", num: "9443537786" },
    { label: "Optical Laboratory", num: "9443639786" }
  ];

  return (
    <section className="ambient-accent ambient-accent--contact relative overflow-hidden py-20" id="contact-locator-section">
      <CinematicBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <motion.span variants={fadeUp} className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">VISIT OR CONTACT</motion.span>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#111111]">
            We're here to help.
          </motion.h2>
          <motion.div variants={fadeUp} className="w-12 h-1 bg-[#fbe311] mx-auto rounded" />
          <motion.p variants={fadeUp} className="text-neutral-500 font-medium text-base">
            Call, WhatsApp, book a free eye test, or visit our premium manufacturing store in Trichy.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Coordinates, Address, Map */}
          <motion.div
            variants={staggerReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-7 space-y-8"
          >
            {/* Embedded Google Maps */}
            <motion.div variants={fadeUp} className="w-full h-80 rounded-3xl overflow-hidden border border-neutral-200/50 shadow-sm relative group">
              <iframe 
                title="Niyaz Opticals location in Trichy"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.9958742614534!2d78.69466581480082!3d10.811617492297693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf508fcba9e59%3A0xe5304b4097f48512!2sMelapudur%20Main%20Rd%2C%20Tiruchirappalli%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1647417281982!5m2!1sen!2sin" 
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                allowFullScreen={false} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2.5 rounded-2xl border border-neutral-200 text-xs font-mono font-bold text-[#261606] shadow-md flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#261606]" />
                <span>Niyaz Opticals outlet</span>
              </div>
            </motion.div>

            {/* Address & Operational Hours Details */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50 p-8 rounded-3xl border border-neutral-200/30">
              
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold tracking-widest text-[#261606]/80 uppercase">STORE ADDRESS</h4>
                <div className="flex gap-2 text-sm text-neutral-600">
                  <MapPin className="w-5 h-5 text-[#261606] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-[#111111]">Niyaz Opticals</p>
                    <p>No 22/1, 1st Floor,</p>
                    <p>Melaputhur Main Road,</p>
                    <p>Tiruchirappalli – 620001,</p>
                    <p>Tamil Nadu, India</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold tracking-widest text-[#261606]/80 uppercase">BUSINESS HOURS</h4>
                  <div className="flex gap-2 text-sm text-neutral-600">
                    <Clock className="w-5 h-5 text-[#261606] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#111111]">Monday – Sunday</p>
                      <p>09:00 AM – 09:00 PM IST</p>
                      <p className="text-xs text-neutral-400 mt-1">Open 365 days / Manufacturing active</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorized Lens Grinding Lab</span>
                </div>
              </div>

            </motion.div>

            {/* Click to Call / WhatsApp Direct Hotlines */}
            <motion.div variants={fadeUp} className="space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-widest text-[#261606]/80 uppercase">DIRECT SUPPORT LINES</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {contactNumbers.map((phone, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={canHover && !shouldReduceMotion ? { y: -2 } : undefined}
                    className="bg-white border border-neutral-200/60 p-4 rounded-2xl flex flex-col justify-between hover:border-[#261606]/30 hover:shadow-sm transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 block font-bold uppercase">{phone.label}</span>
                      <span className="text-sm font-sans font-black text-neutral-800 tracking-tight">{phone.num}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <motion.a
                        whileHover={canHover && !shouldReduceMotion ? { scale: 1.02 } : undefined}
                        whileTap={{ scale: 0.97 }}
                        href={`tel:${phone.num}`}
                        className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-center py-1 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </motion.a>
                      <motion.a
                        whileHover={canHover && !shouldReduceMotion ? { scale: 1.02 } : undefined}
                        whileTap={{ scale: 0.97 }}
                        href={`https://wa.me/91${phone.num}?text=Hi,%20I'm%20interested%20in%20your%20optics.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-center py-1 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" /> Chat
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-sm">
              <div className="mb-5">
                <h3 className="text-lg font-sans font-black tracking-tight text-[#111111]">Send us a message</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Questions about frames, lenses, orders, or store support? Drop it here and our team will reply.
                </p>
              </div>

              {messageSuccess && (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
                  Message sent successfully. Niyaz Opticals will contact you shortly.
                </div>
              )}

              {messageError && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                  {messageError}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="name"
                  required
                  value={contactForm.name}
                  onChange={handleContactInputChange}
                  placeholder="Your name *"
                  className="min-h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-[#261606]"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={contactForm.phone}
                  onChange={handleContactInputChange}
                  placeholder="Phone number *"
                  className="min-h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-[#261606]"
                />
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactInputChange}
                  placeholder="Email optional"
                  className="min-h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-[#261606]"
                />
                <input
                  type="text"
                  name="subject"
                  required
                  value={contactForm.subject}
                  onChange={handleContactInputChange}
                  placeholder="Subject *"
                  className="min-h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition-colors focus:border-[#261606]"
                />
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={handleContactInputChange}
                  placeholder="Message *"
                  className="sm:col-span-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#261606] resize-none"
                />
                <button
                  type="submit"
                  disabled={messageSubmitting}
                  className="sm:col-span-2 min-h-12 rounded-xl bg-[#261606] px-5 text-sm font-bold text-[#fbe311] transition-colors hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {messageSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </motion.div>

          {/* Right Column: Premium Consultation/Eye Test Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, ease: springEase }}
            className="lg:col-span-5 bg-[#261606] text-white p-8 rounded-3xl shadow-xl border border-yellow-500/10"
          >
            <h3 className="text-xl font-sans font-black tracking-tight mb-2">Book Free Eye Test</h3>
            <p className="text-neutral-300 text-xs mb-6">
              Fill out the details below. Our certified Trichy consultation crew will contact you to lock down your home testing or in-store appointment.
            </p>

            {bookingError && (
              <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-100">
                {bookingError}
              </div>
            )}

            {bookingSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-800/80 border border-yellow-500/30 p-6 rounded-2xl text-center space-y-4"
              >
                <div className="w-12 h-12 bg-[#fbe311] rounded-full mx-auto flex items-center justify-center text-[#261606]">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-extrabold text-base text-white">Booking Saved!</h4>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  Thank you for booking with Niyaz Opticals. Our consultation team will contact you shortly on your phone to finalize your schedule slot.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name-input" className="block text-[11px] font-mono tracking-wider uppercase text-neutral-300">Your Name *</label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#fbe311] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone-input" className="block text-[11px] font-mono tracking-wider uppercase text-neutral-300">Phone Number *</label>
                  <input
                    id="phone-input"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9443617786"
                    className="w-full bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#fbe311] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <motion.button
                    type="button"
                    whileHover={canHover && !shouldReduceMotion ? { scale: 1.01 } : undefined}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'Store Visit' }))}
                    className={`min-h-12 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      formData.type === 'Store Visit'
                        ? 'bg-[#fbe311] text-[#261606] border-transparent'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-700/50 hover:bg-neutral-800'
                    }`}
                  >
                    Store Visit (Trichy)
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={canHover && !shouldReduceMotion ? { scale: 1.01 } : undefined}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'Home Eye Test' }))}
                    className={`min-h-12 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      formData.type === 'Home Eye Test'
                        ? 'bg-[#fbe311] text-[#261606] border-transparent'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-700/50 hover:bg-neutral-800'
                    }`}
                  >
                    Home Eye Test
                  </motion.button>
                </div>

                <div className="space-y-1">
                  <label htmlFor="interest-input" className="block text-[11px] font-mono tracking-wider uppercase text-neutral-300">Interested In</label>
                  <select
                    id="interest-input"
                    name="interestedIn"
                    value={formData.interestedIn}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#fbe311] transition-colors"
                  >
                    <option value="Computer Glasses Upgrade">Computer Glasses (Blue Blockers)</option>
                    <option value="Premium Prescription Frame">Premium Optical Eyeglasses</option>
                    <option value="Polarized Luxury Sunglasses">Polarized Sunglasses</option>
                    <option value="Children Flexible Eyewear">Kids Flexible Frame</option>
                    <option value="General Eye Screening">General Power Consultation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message-input" className="block text-[11px] font-mono tracking-wider uppercase text-neutral-300">Message (Optional)</label>
                  <textarea
                    id="message-input"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter details like preferred timing or current prescription history..."
                    className="w-full bg-neutral-900 border border-neutral-700/60 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#fbe311] transition-colors resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={!submitting && canHover && !shouldReduceMotion ? { scale: 1.01 } : undefined}
                  whileTap={submitting ? undefined : { scale: 0.98 }}
                  className="w-full py-4 mt-2 bg-white text-[#261606] hover:bg-[#fbe311] hover:text-[#261606] disabled:bg-neutral-700 disabled:text-neutral-400 font-bold text-sm rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                  id="contact-form-submit-btn"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-neutral-700 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Book Free Eye Test Now</span>
                  )}
                </motion.button>

                <p className="text-[10px] text-center text-neutral-400 pt-2">
                  🛡️ HIPAA Compliant privacy shield. We never sell or share your medical credentials.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
