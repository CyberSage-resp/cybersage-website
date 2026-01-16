import { useEffect, useState, useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Zap, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Send, 
  Linkedin,
  Mail,
  ChevronRight,
  CheckCircle,
  Cpu,
  Search,
  FileText,
  Settings,
  Users,
  ArrowRight,
  Menu,
  X,
  MessageCircle,
  Bot,
  User,
  Loader2,
  Globe,
  Smartphone,
  Apple,
  Layers
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Generate unique session ID
const generateSessionId = () => {
  const stored = localStorage.getItem('cybersage_session_id');
  if (stored) return stored;
  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('cybersage_session_id', newId);
  return newId;
};

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm CyberSage AI Assistant. I can help you with cybersecurity tips and advice. What would you like to know about protecting your digital assets?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContactPrompt, setShowContactPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(generateSessionId());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId.current,
        message: userMessage
      });

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response.data.response 
      }]);

      if (response.data.should_contact) {
        setShowContactPrompt(true);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm having trouble connecting right now. Please try again or contact us directly through the form below!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-cyber-cyan text-cyber-black rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300"
        data-testid="chat-toggle-btn"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-cyber-black border border-white/10 shadow-2xl flex flex-col"
            style={{ height: "500px", maxHeight: "calc(100vh - 150px)" }}
            data-testid="chat-window"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-cyber-gray/50">
              <div className="w-10 h-10 border border-cyber-cyan/50 flex items-center justify-center bg-cyber-cyan/10">
                <Bot className="w-5 h-5 text-cyber-cyan" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm">CyberSage AI</h3>
                <p className="text-xs text-muted-foreground">Security Assistant</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border ${
                    msg.role === "user" 
                      ? "border-cyber-purple/50 bg-cyber-purple/10" 
                      : "border-cyber-cyan/50 bg-cyber-cyan/10"
                  }`}>
                    {msg.role === "user" ? (
                      <User className="w-4 h-4 text-cyber-purple" strokeWidth={1.5} />
                    ) : (
                      <Bot className="w-4 h-4 text-cyber-cyan" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className={`max-w-[75%] p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-cyber-purple/20 border border-cyber-purple/30"
                      : "bg-white/5 border border-white/10"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-cyber-cyan/50 bg-cyber-cyan/10">
                    <Bot className="w-4 h-4 text-cyber-cyan" strokeWidth={1.5} />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3">
                    <Loader2 className="w-5 h-5 text-cyber-cyan animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Contact Prompt */}
            {showContactPrompt && (
              <div className="px-4 py-2 bg-cyber-cyan/10 border-t border-cyber-cyan/30">
                <p className="text-xs text-cyber-cyan mb-2">Ready for personalized security advice?</p>
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90 rounded-none text-xs"
                  onClick={() => setIsOpen(false)}
                >
                  <a href="#contact">Book a Consultation - From $20</a>
                </Button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about cybersecurity..."
                  className="flex-1 bg-transparent border-white/20 focus:border-cyber-cyan rounded-none text-sm"
                  disabled={isLoading}
                  data-testid="chat-input"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90 rounded-none px-3"
                  data-testid="chat-send-btn"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "Process" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-cyber-black/90 backdrop-blur-xl border-b border-white/10' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3" data-testid="nav-logo">
          <div className="w-10 h-10 rounded-none border border-cyber-cyan/50 flex items-center justify-center bg-cyber-cyan/10">
            <Shield className="w-6 h-6 text-cyber-cyan" strokeWidth={1.5} />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">CyberSage</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-cyber-cyan transition-colors duration-300"
              data-testid={`nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
          <Button 
            asChild
            className="bg-transparent border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300 rounded-none"
            data-testid="nav-cta"
          >
            <a href="#contact">Get Started</a>
          </Button>
        </div>

        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cyber-black/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-cyber-cyan transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-bg" data-testid="hero-section">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1648558835726-fde0a101465b?w=1920&q=80')` 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-black via-cyber-black/80 to-cyber-black" />
      <div className="absolute inset-0 hero-glow" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan text-sm font-mono">
              <Cpu className="w-4 h-4" strokeWidth={1.5} />
              AI-Powered Security
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-tight"
          >
            Protecting Your<br />
            <span className="gradient-text">Digital Assets</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            AI-powered cybersecurity solutions for startups, small businesses, and freelancers. 
            Fast, actionable, and accessible—even without a technical team.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300 rounded-none font-semibold"
              data-testid="hero-cta-primary"
            >
              <a href="#contact">
                Get Security Audit
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 hover:bg-white/5 hover:border-cyber-cyan/50 rounded-none"
              data-testid="hero-cta-secondary"
            >
              <a href="#services">View Services</a>
            </Button>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '24h', label: 'Delivery Time' },
              { value: '$20', label: 'Starting Price' },
              { value: '100%', label: 'Actionable' },
              { value: '0', label: 'Jargon' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold text-cyber-cyan text-glow">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border border-white/20 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-cyber-cyan rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

const AboutSection = () => {
  const features = [
    { icon: Zap, title: 'Quick AI Scans', description: 'AI-powered scans deliver results in hours, not weeks' },
    { icon: CheckCircle, title: 'Actionable Reports', description: 'Clear recommendations you can implement immediately' },
    { icon: DollarSign, title: 'Affordable', description: 'Enterprise-grade security at freelancer-friendly prices' },
    { icon: MessageSquare, title: 'No Jargon', description: 'Reports written in plain English, not tech speak' },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span 
              variants={fadeInUp}
              className="text-cyber-cyan font-mono text-sm tracking-wider"
            >
              ABOUT US
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6"
            >
              Who We Are
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-muted-foreground text-lg leading-relaxed mb-8"
            >
              We help startups, small businesses, and freelancers secure their digital assets 
              using AI-powered tools and workflows. Our mission is to make cybersecurity fast, 
              actionable, and accessible—even if you don't have a dedicated technical team.
            </motion.p>

            <motion.div 
              variants={staggerContainer}
              className="grid sm:grid-cols-2 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="glass-card p-5"
                >
                  <feature.icon className="w-8 h-8 text-cyber-cyan mb-3" strokeWidth={1.5} />
                  <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 rounded-none" />
              <img 
                src="https://images.unsplash.com/photo-1640730204494-21ecdf5ce03a?w=600&q=80"
                alt="AI Cybersecurity"
                className="w-full h-full object-cover"
              />
              <div className="absolute -inset-4 border border-cyber-cyan/30 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = ({ services }) => {
  const iconMap = {
    'ai-security-audit-lite': Shield,
    'ai-port': Search,
    'ai-threat-report': FileText,
    'custom-ai-workflow': Settings,
    'consultation': Users,
    'web-development': Globe,
    'ios-development': Apple,
    'android-development': Smartphone,
    'cross-platform-app': Layers,
  };

  // Group services by category
  const securityServices = services.filter(s => s.category === 'security' || !s.category);
  const devServices = services.filter(s => s.category === 'development');

  return (
    <section id="services" className="py-24 md:py-32 bg-cyber-gray/30 relative" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span 
            variants={fadeInUp}
            className="text-cyber-cyan font-mono text-sm tracking-wider"
          >
            OUR SERVICES
          </motion.span>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mt-4"
          >
            What We Offer
          </motion.h2>
        </motion.div>

        {/* Cybersecurity Services */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.h3 
            variants={fadeInUp}
            className="font-heading text-xl md:text-2xl font-semibold mb-8 flex items-center gap-3"
          >
            <Shield className="w-6 h-6 text-cyber-cyan" strokeWidth={1.5} />
            Cybersecurity Services
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityServices.map((service) => {
              const IconComponent = iconMap[service.id] || Shield;
              return (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                  className="glass-card tracing-border p-8"
                  data-testid={`service-card-${service.id}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 border border-cyber-cyan/30 flex items-center justify-center bg-cyber-cyan/5">
                      <IconComponent className="w-7 h-7 text-cyber-cyan" strokeWidth={1.5} />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-heading font-bold text-cyber-cyan">${service.price}</span>
                      <p className="text-xs text-muted-foreground">starting</p>
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    <span>Delivery: {service.delivery}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Development Services */}
        {devServices.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h3 
              variants={fadeInUp}
              className="font-heading text-xl md:text-2xl font-semibold mb-8 flex items-center gap-3"
            >
              <Globe className="w-6 h-6 text-cyber-purple" strokeWidth={1.5} />
              Development Services
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {devServices.map((service) => {
                const IconComponent = iconMap[service.id] || Globe;
                return (
                  <motion.div
                    key={service.id}
                    variants={fadeInUp}
                    className="glass-card p-6 border-cyber-purple/20 hover:border-cyber-purple/50"
                    data-testid={`service-card-${service.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 border border-cyber-purple/30 flex items-center justify-center bg-cyber-purple/5">
                        <IconComponent className="w-6 h-6 text-cyber-purple" strokeWidth={1.5} />
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-heading font-bold text-cyber-purple">${service.price}</span>
                        <p className="text-xs text-muted-foreground">starting</p>
                      </div>
                    </div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{service.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-4 h-4" strokeWidth={1.5} />
                      <span>{service.delivery}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { number: '01', title: 'Reach Out', description: 'Send a DM on LinkedIn or email your request to get started.' },
    { number: '02', title: 'Share Info', description: 'Provide your website URL or system details for analysis.' },
    { number: '03', title: 'AI Scan & Analysis', description: 'We run a complete AI assessment with findings and security check.' },
    { number: '04', title: 'Optional Follow-Up', description: 'Schedule a consultation to implement recommendations.' },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span 
            variants={fadeInUp}
            className="text-cyber-cyan font-mono text-sm tracking-wider"
          >
            PROCESS
          </motion.span>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mt-4"
          >
            How It Works
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative"
              data-testid={`step-${index + 1}`}
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-cyber-cyan/50 to-transparent" />
              )}
              
              <div className="glass-card p-6 h-full">
                <div className="text-5xl font-heading font-bold text-cyber-cyan/20 mb-4">{step.number}</div>
                <h3 className="font-heading text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialsSection = ({ testimonials }) => {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-cyber-gray/30 relative" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span 
            variants={fadeInUp}
            className="text-cyber-cyan font-mono text-sm tracking-wider"
          >
            TESTIMONIALS
          </motion.span>
          <motion.h2 
            variants={fadeInUp}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mt-4"
          >
            Proven Results
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={fadeInUp}
              className="glass-card p-8"
              data-testid={`testimonial-${testimonial.id}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-14 h-14 object-cover border border-cyber-cyan/30"
                />
                <div>
                  <h4 className="font-heading font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ContactSection = ({ services }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}/contact`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: '', email: '', service: '', message: '' });
      }
    } catch (error) {
      toast.error('Failed to submit. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.span 
              variants={fadeInUp}
              className="text-cyber-cyan font-mono text-sm tracking-wider"
            >
              GET IN TOUCH
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6"
            >
              Ready to Secure<br />Your Digital Assets?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-muted-foreground text-lg mb-8"
            >
              Fill out the form and we'll get back to you within 24 hours. 
              Alternatively, reach out directly through LinkedIn or email.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 glass-card hover:border-cyber-cyan/50 transition-colors group"
                data-testid="contact-linkedin"
              >
                <div className="w-12 h-12 border border-cyber-cyan/30 flex items-center justify-center bg-cyber-cyan/5 group-hover:bg-cyber-cyan/10 transition-colors">
                  <Linkedin className="w-6 h-6 text-cyber-cyan" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold">LinkedIn</p>
                  <p className="text-sm text-muted-foreground">Send us a DM</p>
                </div>
                <ChevronRight className="ml-auto w-5 h-5 text-muted-foreground group-hover:text-cyber-cyan transition-colors" />
              </a>

              <a 
                href="mailto:contact@cybersage.ai"
                className="flex items-center gap-4 p-4 glass-card hover:border-cyber-cyan/50 transition-colors group"
                data-testid="contact-email"
              >
                <div className="w-12 h-12 border border-cyber-cyan/30 flex items-center justify-center bg-cyber-cyan/5 group-hover:bg-cyber-cyan/10 transition-colors">
                  <Mail className="w-6 h-6 text-cyber-cyan" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">contact@cybersage.ai</p>
                </div>
                <ChevronRight className="ml-auto w-5 h-5 text-muted-foreground group-hover:text-cyber-cyan transition-colors" />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6" data-testid="contact-form">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="bg-transparent border-white/20 focus:border-cyber-cyan rounded-none"
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="bg-transparent border-white/20 focus:border-cyber-cyan rounded-none"
                  data-testid="contact-email-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <Select 
                  value={formData.service} 
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger 
                    className="bg-transparent border-white/20 focus:border-cyber-cyan rounded-none"
                    data-testid="contact-service-select"
                  >
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-black border-white/20">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - ${service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your security needs..."
                  required
                  rows={4}
                  className="bg-transparent border-white/20 focus:border-cyber-cyan rounded-none resize-none"
                  data-testid="contact-message-input"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300 rounded-none font-semibold"
                data-testid="contact-submit-btn"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-cyber-cyan/50 flex items-center justify-center bg-cyber-cyan/10">
              <Shield className="w-5 h-5 text-cyber-cyan" strokeWidth={1.5} />
            </div>
            <span className="font-heading font-bold tracking-tight">CyberSage</span>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CyberSage. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 transition-all"
              data-testid="footer-linkedin"
            >
              <Linkedin className="w-5 h-5" strokeWidth={1.5} />
            </a>
            <a 
              href="mailto:contact@cybersage.ai"
              className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 transition-all"
              data-testid="footer-email"
            >
              <Mail className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, testimonialsRes] = await Promise.all([
          axios.get(`${API}/services`),
          axios.get(`${API}/testimonials`)
        ]);
        setServices(servicesRes.data.services);
        setTestimonials(testimonialsRes.data.testimonials);
      } catch (error) {
        console.error('Error fetching data:', error);
        setServices([
          { id: 'ai-security-audit-lite', name: 'AI Security Audit Lite', description: 'Quick AI-powered security scan', delivery: '24 hours', price: 20 },
          { id: 'ai-port', name: 'AI Port', description: 'Port scanning and vulnerability assessment', delivery: '24 hours', price: 20 },
          { id: 'ai-threat-report', name: 'AI-Powered Threat Report', description: 'Detailed threat analysis', delivery: '48 hours', price: 75 },
          { id: 'custom-ai-workflow', name: 'Custom AI Detection Workflow', description: 'Tailored AI detection system', delivery: '48 hours', price: 75 },
          { id: 'consultation', name: 'Consultation & Recommendations', description: 'One-on-one security consultation', delivery: 'Flexible', price: 20 },
        ]);
        setTestimonials([
          { id: '1', name: 'Sarah Chen', role: 'Founder, TechStart', content: 'CyberSage identified vulnerabilities we never knew existed.', avatar: 'https://images.unsplash.com/photo-1520529277867-dbf8c5e0b340?w=100' },
          { id: '2', name: 'Marcus Johnson', role: 'CTO, CloudNine', content: 'The threat report was incredibly detailed and easy to understand.', avatar: 'https://images.unsplash.com/photo-1589220286904-3dcef62c68ee?w=100' },
          { id: '3', name: 'Emily Rodriguez', role: 'Freelance Developer', content: 'CyberSage gave me peace of mind at a price I could afford.', avatar: 'https://images.pexels.com/photos/5393822/pexels-photo-5393822.jpeg?w=100' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection services={services} />
      <HowItWorksSection />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection services={services} />
      <Footer />
      <ChatWidget />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#1A1A1A',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            color: '#EDEDED',
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
