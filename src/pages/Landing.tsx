import { motion } from "framer-motion";
import { Shield, Activity, TriangleAlert, Zap, RotateCw, ChevronRight, Heart, Smartphone, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/ParticleBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: TriangleAlert,
    title: "Fall Detection",
    description: "Instant alerts when a fall is detected with real-time wristband monitoring.",
    gradient: "from-destructive/20 to-destructive/5",
    iconColor: "text-destructive",
    borderHover: "hover:border-destructive/40",
    glow: "hover:shadow-[0_0_30px_hsl(0,76%,58%,0.15)]",
  },
  {
    icon: Zap,
    title: "Acceleration Tracking",
    description: "Monitor movement intensity with precise accelerometer data across all axes.",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderHover: "hover:border-primary/40",
    glow: "hover:shadow-[0_0_30px_hsl(170,85%,48%,0.15)]",
  },
  {
    icon: RotateCw,
    title: "Gyroscope Analysis",
    description: "Track rotational movement patterns to detect unusual motion signatures.",
    gradient: "from-[hsl(280,68%,58%)]/20 to-[hsl(280,68%,58%)]/5",
    iconColor: "text-[hsl(280,68%,58%)]",
    borderHover: "hover:border-[hsl(280,68%,58%)]/40",
    glow: "hover:shadow-[0_0_30px_hsl(280,68%,58%,0.15)]",
  },
];

const stats = [
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "<2s", label: "Alert Response" },
  { value: "24/7", label: "Continuous Monitoring" },
  { value: "50+", label: "Wristbands Supported" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden relative bg-background">
      {/* Live particle background */}
      <ParticleBackground />

      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -25, 15, 0], y: [0, 30, -25, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-5%] right-[10%] w-[400px] h-[400px] rounded-full bg-[hsl(280,68%,58%)]/[0.04] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 20, -30, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-accent/[0.03] blur-[80px]"
        />
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-60" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border/50 glass-card sticky top-0 z-30"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center breathing-ring"
            >
              <Shield className="h-5 w-5 text-primary" />
            </motion.div>
            <span className="text-xl font-display font-bold tracking-tight text-foreground">
              SafeStep
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-border hover:bg-secondary font-display font-semibold gap-2"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold gap-2 group"
            >
              Open Dashboard
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-28 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-mono mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Real-time Wristband Monitoring
            <span className="h-2 w-2 rounded-full bg-primary pulse-dot" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Protecting Lives with{" "}
            <motion.span
              className="text-gradient inline-block"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundSize: "200% 200%",
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(280, 68%, 58%), hsl(var(--primary)))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Intelligent Motion
            </motion.span>{" "}
            Sensing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SafeStep monitors wristband sensors in real-time — detecting falls,
            tracking acceleration, and analyzing gyroscopic data to keep users safe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-base px-8 py-6 gap-2 glow-primary w-full sm:w-auto"
              >
                Go to Live Dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="border-border hover:bg-secondary font-display font-semibold text-base px-8 py-6 w-full sm:w-auto"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="mt-16 sm:mt-20 max-w-5xl mx-auto"
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="sensor-card-gradient rounded-2xl border border-border/50 p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 pointer-events-none z-10" />
            <div className="grid grid-cols-3 gap-4 relative">
              {[
                { label: "Fall Status", value: "ALL SAFE", color: "text-primary", dotColor: "bg-primary" },
                { label: "Acceleration", value: "1.2 g", color: "text-foreground", dotColor: "bg-warning" },
                { label: "Gyroscope", value: "45.3 °/s", color: "text-foreground", dotColor: "bg-[hsl(280,68%,58%)]" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-xl border border-border/30 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${item.dotColor} pulse-dot`} />
                    <p className="text-xs text-muted-foreground font-mono">{item.label}</p>
                  </div>
                  <p className={`text-xl sm:text-2xl font-mono font-bold ${item.color}`}>{item.value}</p>
                </motion.div>
              ))}
            </div>
            {/* Animated chart bars */}
            <div className="mt-6 h-24 flex items-end gap-1 relative">
              {Array.from({ length: 40 }).map((_, i) => {
                const height = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 30;
                return (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 1 + i * 0.03, duration: 0.4 }}
                    className="flex-1 rounded-t-sm origin-bottom"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(to top, hsl(var(--primary) / 0.1), hsl(var(--primary) / ${0.15 + (height / 100) * 0.25}))`,
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 glass-card relative z-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.p
                  className="text-3xl sm:text-5xl font-display font-bold text-gradient"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground font-mono mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-xs font-mono text-muted-foreground mb-4">
            <Activity className="h-3 w-3 text-primary" /> Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Comprehensive Motion Monitoring
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three critical sensor streams working together to provide complete safety coverage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className={`sensor-card-gradient rounded-2xl border border-border/50 p-8 group ${feature.borderHover} ${feature.glow} transition-all duration-500`}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
              >
                <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
              </motion.div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Three simple steps to continuous protection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30" />

          {[
            { icon: Smartphone, step: "01", title: "Wear", desc: "Users wear the SafeStep wristband throughout the day." },
            { icon: Activity, step: "02", title: "Monitor", desc: "Sensors stream motion data in real-time to the dashboard." },
            { icon: Heart, step: "03", title: "Protect", desc: "Instant alerts are triggered when falls or anomalies are detected." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center relative"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.05 }}
                className="h-16 w-16 rounded-2xl glass-card border border-border/50 flex items-center justify-center mx-auto mb-5"
              >
                <item.icon className="h-7 w-7 text-primary" />
              </motion.div>
              <span className="inline-block text-xs font-mono text-primary mb-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">{item.step}</span>
              <h3 className="text-lg font-display font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="sensor-card-gradient rounded-3xl border border-primary/20 p-10 sm:p-16 text-center relative overflow-hidden glow-primary"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 breathing-ring">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Ready to Monitor?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Access the live dashboard to see real-time sensor data from all connected wristbands.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-base px-10 py-6 gap-2"
            >
              Open Live Dashboard
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 relative z-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-display font-semibold text-foreground">SafeStep</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            © 2026 SafeStep. Real-time fall detection & motion monitoring.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
