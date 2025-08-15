import React, { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import {
  Gift,
  ShoppingCart,
  Sparkles,
  Package,
  Send,
  Phone,
  Info,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Facebook,
  Instagram,
  MapPin,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

// =============================
// Configuración
// =============================
const BRAND = "My Gift Box";
const WHATSAPP_NUMBER = "593969563324"; // tu número con código de país, sin +
const WHATSAPP_LINK_BASE = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const kitsData = [
  {
    id: "KIT1",
    name: "KIT1 — Mi Mejor Amig@",
    price: 19.99,
    short: "Un hermoso detalle para tu querid@ mejor amig@.",
    heroImg:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    items: [
      "Vela aromática de lavanda",
      "Taza de cerámica artesanal",
      "Galletas gourmet (100 g)",
      "Tarjeta con mensaje personalizado",
    ],
    colors: ["Marfil", "Lavanda", "Verde salvia"],
  },
  {
    id: "KIT2",
    name: "KIT2 — La mejor Pareja",
    price: 44.9,
    short: "Demuéstrale a tu pareja cuanto la quieres.",
    heroImg:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1600&auto=format&fit=crop",
    items: [
      "Café especialidad (250 g)",
      "Mug térmico",
      "Tableta de chocolate 70%",
      "Tarjeta con mensaje personalizado",
    ],
    colors: ["Carbón", "Cobre", "Azul petróleo"],
  },
  {
    id: "KIT3",
    name: "KIT3 — Brunch Mini",
    price: 49.9,
    short: "Sabores que celebran con sencillez.",
    heroImg:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop",
    items: [
      "Mermelada artesanal",
      "Granola premium",
      "Miel de flores (120 g)",
      "Tarjeta con mensaje personalizado",
    ],
    colors: ["Arena", "Rojo vino", "Azul cielo"],
  },
];

// =============================
// Helpers & Animations
// =============================
const Section = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const NavLink = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`text-sm md:text-base px-3 py-2 rounded-xl transition hover:bg-white/10 cursor-pointer ${
      active ? "text-white" : "text-white/80"
    }`}
  >
    {label}
  </button>
);

const Price = ({ value }) => (
  <div className="text-2xl font-semibold tracking-tight">$ {value.toFixed(2)}</div>
);

// Botón base + Motion
const BtnBase = ({ className = "", children, ...props }) => (
  <Button className={`relative overflow-hidden cursor-pointer ${className}`} {...props}>
    {children}
  </Button>
);
const MBtn = motion(BtnBase);

// Card animada
const MCard = motion(Card);

// Variants
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

// =============================
// Componentes de UI especiales
// =============================
// 1) Shimmer overlay para botones (se activa con prop show)
const Shimmer = ({ show = false }) => (
  <motion.span
    aria-hidden
    initial={false}
    animate={show ? { x: ["-150%", "150%"] } : { x: "-150%" }}
    transition={{ duration: 1.6, repeat: show ? Infinity : 0, ease: "linear" }}
    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30 blur-sm"
  />
);

// 2) FAQ item con animación de apertura
function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="group">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left text-base font-semibold py-5 cursor-pointer"
      >
        {q}
        <motion.span animate={{ rotate: open ? 90 : 0 }}>
          <ChevronRight className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="pb-5 text-sm text-muted-foreground">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-px bg-neutral-200" />
    </div>
  );
}

// 3) Confetti simple con Framer (sin librerías externas)
function ConfettiBurst({ show, onComplete }) {
  const colors = ["#6366f1", "#f472b6", "#22c55e", "#f59e0b", "#06b6d4"];
  const pieces = Array.from({ length: 140 });
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onComplete && onComplete(), 1600);
    return () => clearTimeout(t);
  }, [show, onComplete]);
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          initial={{
            x: window.innerWidth / 2 + (Math.random() * 60 - 30),
            y: window.innerHeight / 2 + (Math.random() * 40 - 20),
            rotate: 0,
            scale: 1,
          }}
          animate={{
            x: (window.innerWidth / 2) + (Math.random() * 900 - 450),
            y: (window.innerHeight / 2) + (Math.random() * 700 + 250),
            rotate: Math.random() * 720,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: 6 + Math.random() * 10,
            height: 10 + Math.random() * 16,
            backgroundColor: colors[i % colors.length],
            borderRadius: Math.random() > 0.5 ? 2 : 9999,
            boxShadow: "0 0 0.5px rgba(0,0,0,0.15)",
          }}
        />
      ))}
    </div>
  );
}

// =============================
// Utilidades compartidas
// =============================
function buildContactMsg({ nombre, interes, mensaje }) {
  const lines = [
    `Hola, me gustaría más información sobre los kits de ${BRAND}.`,
    nombre ? `Mi nombre es: ${nombre}` : null,
    interes ? `Me interesa: ${interes}` : null,
    mensaje ? `Mensaje: ${mensaje}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

// =============================
// Páginas
// =============================
function Landing({ goKits, goHow, openKit }) {
  // Parallax hero
  const containerRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const translateHeroImg = {
    x: useTransform(mx, [-0.5, 0.5], [-10, 10]),
    y: useTransform(my, [-0.5, 0.5], [-6, 6]),
  };
  const translateBlob1 = {
    x: useTransform(mx, [-0.5, 0.5], [6, -6]),
    y: useTransform(my, [-0.5, 0.5], [8, -8]),
  };
  const translateBlob2 = {
    x: useTransform(mx, [-0.5, 0.5], [-6, 6]),
    y: useTransform(my, [-0.5, 0.5], [-8, 8]),
  };

  const onMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x);
    my.set(y);
  };

  return (
    <>
      {/* ===== HERO (con fondo acotado y overlay) ===== */}
      <div
        className="relative overflow-hidden min-h-[72vh]"
        ref={containerRef}
        onMouseMove={onMouseMove}
      >
        {/* Fondo y overlay solo para el hero */}
        <img
          src="https://talamobile.mx/wp-content/uploads/sites/5/2023/11/chica-joven-regalo.jpg"
          alt="Hero"
          className="absolute inset-0 z-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

        {/* Blobs animados (parallax) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
          style={translateBlob1}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ y: [0, 18, 0], x: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
          style={translateBlob2}
        />

        {/* Contenido del hero por encima del overlay */}
        <Section className="pt-24 pb-16 relative z-10">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <motion.div variants={fadeUp}>
              <Badge className="bg-white/20 text-white backdrop-blur">
                Nuevo · Envíos por WhatsApp
              </Badge>
              <h1 className="mt-4 text-4xl md:text-6xl font-bold text-white leading-tight">
                Regalar,{" "}
                <span className="underline decoration-white/40">sin complicarte</span>.
              </h1>
              <p className="mt-4 text-white/90 text-lg">
                Elige uno de nuestros 3 kits pre-creados, personaliza un detalle,
                paga y nosotros lo llevamos a la puerta.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <MBtn
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goKits}
                  className="bg-white text-black hover:bg-indigo-700 hover:text-white"
                >
                  <Shimmer show={true} />
                  <ShoppingCart className="mr-2 h-4 w-4" /> Ver los kits
                </MBtn>
                <MBtn
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goHow}
                  variant="secondary"
                  className="bg-transparent border border-white/30 text-white hover:bg-white/10"
                >
                  <Info className="mr-2 h-4 w-4" /> ¿Cómo funciona?
                </MBtn>
              </div>
              <div className="mt-10 flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Personalización
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Pago fácil
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Entrega a domicilio
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="relative">
                <motion.img
                  src="https://talamobile.mx/wp-content/uploads/sites/5/2023/11/chica-joven-regalo.jpg"
                  alt="Regalando felicidad"
                  className="rounded-3xl shadow-2xl"
                  style={translateHeroImg}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                />
                <div className="absolute -bottom-6 -left-6 rotate-[-8deg]">
                  <Card className="rounded-2xl shadow-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> 3 kits, 1 decisión
                      </CardTitle>
                      <CardDescription>Tu regalo listo en minutos</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ===== CONTENIDO POSTERIOR (fuera del hero) ===== */}
      <div className="bg-white">
        <Section className="py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {kitsData.map((kit) => (
              <MCard
                key={kit.id}
                className="rounded-3xl overflow-hidden"
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <img
                  src={kit.heroImg}
                  alt={kit.name}
                  className="h-48 w-full object-cover"
                />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{kit.name}</span>
                    <Badge className="bg-indigo-600">Popular</Badge>
                  </CardTitle>
                  <CardDescription>{kit.short}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Price value={kit.price} />
                </CardContent>
                <CardFooter className="flex gap-3">
                  <a
                    href={`#kits-${kit.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      openKit(kit.id);
                    }}
                    className="text-sm text-indigo-700 hover:underline flex items-center cursor-pointer"
                  >
                    Ver detalles <ChevronRight className="h-4 w-4" />
                  </a>
                </CardFooter>
              </MCard>
            ))}
          </div>
        </Section>

        {/* FAQ en landing */}
        <Section className="pb-16 pt-0">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Preguntas frecuentes
            </h3>
            <div className="mt-6 rounded-2xl border bg-white px-2 sm:px-4">
              <FaqItem
                q="¿Qué incluye un kit de regalo?"
                a="Cada kit trae productos seleccionados con cuidado (ver detalle en la página de cada kit) y siempre incluye una tarjeta para tu mensaje personalizado."
              />
              <FaqItem
                q="¿Puedo personalizar mi kit?"
                a="Claro que sí, la personalización del kit varía en función del kit que escojas."
              />
              <FaqItem
                q="¿Cómo funciona la entrega?"
                a="Coordinamos todo por WhatsApp: dirección, fecha y franja horaria. Te compartimos el enlace de pago y confirmación."
              />
              <FaqItem
                q="¿Cuánto demora el envío?"
                a="Dependiendo de la cobertura, normalmente dentro de 24–48 horas hábiles. Si lo necesitas para una fecha específica, cuéntanos por WhatsApp."
              />
              <FaqItem
                q="¿Puedo enviar el regalo directo a la persona a la que se lo quiero obsequiar?"
                a="¡Claro! Indícanos la dirección del destinatario y entregamos el kit con tu tarjeta personalizada."
              />
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}

function KitsOverview({ openKit }) {
  return (
    <Section className="py-14">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Nuestros Kits</h2>
        <p className="mt-2 text-muted-foreground">Tres opciones, cero complicaciones.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {kitsData.map((kit) => (
          <MCard
            key={kit.id}
            className="rounded-3xl overflow-hidden"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.15 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <img src={kit.heroImg} alt={kit.name} className="h-44 w-full object-cover" />
            <CardHeader>
              <CardTitle>{kit.name}</CardTitle>
              <CardDescription>{kit.short}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <Price value={kit.price} />
              <Badge variant="outline">{kit.id}</Badge>
            </CardContent>
            <CardFooter>
              <MBtn
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => openKit(kit.id)}
  className="w-full bg-indigo-700 text-white hover:bg-indigo-800"
>
  <Gift className="mr-2 h-4 w-4" /> Ver {kit.id}
</MBtn>
            </CardFooter>
          </MCard>
        ))}
      </div>
    </Section>
  );
}

function KitDetail({ kitId, triggerGo, goKits }) {
  const kit = useMemo(() => kitsData.find((k) => k.id === kitId) ?? kitsData[0], [kitId]);
  const [color, setColor] = useState(kit.colors[0]);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const remaining = 120 - mensaje.length;
  const waMessage = `Hola, soy cliente de ${BRAND}. Quiero comprar el ${kit.id}.

Personalización:
• Color de cinta/forro: ${color}
• Para: ${nombre || "(añadir)"}
• Mensaje corto: ${mensaje || "(añadir)"}

¿Me ayudan con el pago y envío?`;

  return (
    <div className="bg-white">
      <Section className="py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <motion.div variants={fadeUp} initial="initial" animate="animate">
            <motion.img src={kit.heroImg} alt={kit.name} className="rounded-3xl shadow-xl" whileHover={{ scale: 1.02 }} />
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Incluye</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                {kit.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> {it}</li>
                ))}
              </ul>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="initial" animate="animate">
            <div className="flex items-center gap-2 mb-2"><Badge variant="outline">{kit.id}</Badge></div>
            <h2 className="text-3xl font-bold tracking-tight">{kit.name}</h2>
            <p className="mt-2 text-muted-foreground">{kit.short}</p>
            <div className="mt-4"><Price value={kit.price} /></div>

            <div className="mt-8 grid gap-4">
              <div>
                <label className="text-sm font-medium">Color de cinta/forro</label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Elige un color" /></SelectTrigger>
                  <SelectContent>
                    {kit.colors.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Para (nombre del destinatario)</label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Ana" className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Mensaje corto para la tarjeta</label>
                <Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Máx. 120 caracteres" className="mt-2" maxLength={120} />
                {/* Contador animado */}
                <div className="text-xs mt-1">
                  <motion.span
                    key={remaining}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 6, opacity: 0 }}
                    className={`inline-block ${remaining <= 15 ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    {remaining} caracteres restantes
                  </motion.span>
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <MBtn
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    triggerGo(WHATSAPP_LINK_BASE(waMessage));
                  }}
                >
                  <Send className="mr-2 h-4 w-4"/> Comprar por WhatsApp
                </MBtn>
                <MBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} variant="outline" onClick={goKits}>
                    <ArrowRight className="mr-2 h-4 w-4"/> Ver otros kits
                  </MBtn>
              </div>
            </div>

            <div className="mt-10 p-5 rounded-2xl bg-neutral-50 border">
              <h4 className="font-semibold mb-2 flex items-center gap-2"><Package className="h-4 w-4"/> Envíos</h4>
              <p className="text-sm text-muted-foreground">Todos los pedidos se coordinan por WhatsApp. Te confirmamos dirección, fecha y horario estimado, y te enviamos el link de pago.</p>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}

function About() {
  const milestones = [
    { year: "2022", title: "La idea en la mesa de cocina", desc: "Entre agendas apretadas nació una idea simple: regalar con sentido, sin complicarse. Los primeros kits se armaron a mano, con curaduría cálida y presentación impecable." },
    { year: "2023", title: "La primera ola de KitLovers", desc: "Descubrimos que un pequeño toque personal (color de cinta, mensaje corto) transforma el gesto. Nuestros clientes se volvieron embajadores." },
    { year: "2024", title: "Logística clara por WhatsApp", desc: "Estandarizamos el proceso: eliges, personalizas, pagas y coordinamos por WhatsApp. Simple, humano y confiable." },
    { year: "Hoy", title: "My Gift Box", desc: "Seguimos con la misma misión: ayudarte a celebrar a tus seres queridos de forma personal, cuidada y sin estrés." },
  ];

  return (
    <div className="bg-white">
      <Section className="py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Nuestra historia</h2>
          <div className="prose prose-neutral mt-6">
            <p><strong>{BRAND}</strong> nació con una convicción sencilla: regalar no debería ser complicado. Queríamos una forma de decir “me importas” sin perder el toque humano.</p>
            <p>Los primeros kits se armaron en la mesa de mi cocina, mezclando productos de calidad con una presentación impecable. Aprendimos que el detalle marca la diferencia: una cinta en el color favorito, un mensaje corto, una curaduría cálida.</p>
            <p>Con el tiempo crecimos, pero mantuvimos el mismo estándar: cajas listas para regalar, personalización y logística clara por WhatsApp. Así, tú eliges en minutos y nosotros nos encargamos del resto.</p>
          </div>

          <div className="mt-10 relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-200 hidden sm:block" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <MCard key={i} className="rounded-2xl" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.15 }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{m.title}</CardTitle>
                      <Badge variant="outline">{m.year}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </CardContent>
                </MCard>
              ))}
            </div>

            <motion.div className="mt-8 p-5 rounded-2xl bg-neutral-50 border" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <blockquote className="text-sm md:text-base">“Regalar bien es pensar en la persona, no en la complicación.”<span className="block mt-2 text-neutral-500">— Equipo {BRAND}</span></blockquote>
            </motion.div>
          </div>
        </div>
      </Section>
    </div>
  );
}

function HowItWorks({ goKits }) {
  const steps = [
    { icon: Gift, title: "Elige un kit", desc: "KIT1, KIT2 o KIT3. Todos incluyen una tarjeta personalizable." },
    { icon: Sparkles, title: "Personaliza un detalle", desc: "Selecciona color de cinta/forro y añade un mensaje corto." },
    { icon: ShoppingCart, title: "Paga fácil", desc: "Te enviamos el enlace de pago por WhatsApp." },
    { icon: Send, title: "Coordinamos envío", desc: "Confirmamos dirección y fecha. ¡Listo!" },
  ];

  return (
    <Section className="py-14">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold">¿Cómo funciona?</h2>
        <p className="mt-2 text-muted-foreground">Regala en cuatro pasos. Todos los envíos se tramitan por WhatsApp.</p>
      </div>
      <div className="mt-10 grid md:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <MCard key={i} className="rounded-3xl" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }}>
            <CardHeader>
              <motion.div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow" whileHover={{ rotate: -6 }}>
                {React.createElement(s.icon, { className: "h-6 w-6" })}
              </motion.div>
              <CardTitle className="mt-3">{s.title}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
          </MCard>
        ))}
      </div>
      <div className="mt-10 text-center">
        <MBtn whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={goKits} className="inline-flex">
          Ver los kits <ChevronRight className="ml-2 h-4 w-4" />
        </MBtn>
      </div>
    </Section>
  );
}

function Contact({ triggerGo }) {
  const [nombre, setNombre] = useState("");
  const [interes, setInteres] = useState("");
  const [mensaje, setMensaje] = useState("");
  const buildMsg = () => buildContactMsg({ nombre, interes, mensaje });
  return (
    <Section className="py-14">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold">Contacto</h2>
          <p className="mt-2 text-muted-foreground">Todos los pedidos y envíos se coordinan por <strong>WhatsApp</strong>.</p>

          <div className="mt-6 space-y-3">
            <MBtn
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => { e.preventDefault(); triggerGo(WHATSAPP_LINK_BASE(buildMsg())); }}
            >
              <Phone className="mr-2 h-4 w-4"/> Escribir por WhatsApp
            </MBtn>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Instagram className="h-4 w-4"/> @mygiftbox</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4"/> Envíos locales (coordinar cobertura)</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4"/> Lun–Sáb, 9:00–18:00</div>
          </div>
        </motion.div>
        <MCard className="rounded-3xl" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <CardHeader>
            <CardTitle>Déjanos tu mensaje</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input placeholder="Tu nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} />
            <Input placeholder="¿Qué kit te interesa? (KIT1, KIT2, KIT3)" value={interes} onChange={(e)=>setInteres(e.target.value)} />
            <Textarea placeholder="Escribe tu mensaje" value={mensaje} onChange={(e)=>setMensaje(e.target.value)} />
          </CardContent>
          <CardFooter>
            <MBtn
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
              onClick={(e) => { e.preventDefault(); triggerGo(WHATSAPP_LINK_BASE(buildMsg())); }}
            >
              <Send className="mr-2 h-4 w-4"/> Enviar por WhatsApp
            </MBtn>
          </CardFooter>
        </MCard>
      </div>
    </Section>
  );
}

// =============================
// App principal con transiciones entre páginas
// =============================
const PAGES = {
  LANDING: "landing",
  KITS: "kits",
  KIT: "kit",
  ABOUT: "about",
  HOW: "how",
  CONTACT: "contact",
};

export default function MyGiftBoxSite() {
  const [page, setPage] = useState(PAGES.LANDING);
  const [kitPage, setKitPage] = useState("KIT1");

  // Confetti y navegación diferida a WhatsApp
  const [confetti, setConfetti] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(null);
  const triggerGo = (url) => {
    setPendingUrl(url);
    setConfetti(true);
  };

  const openKit = (id) => {
    setKitPage(id);
    setPage(PAGES.KIT);
  };

  // Estado navbar móvil
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (p) => {
    setPage(p);
    setMobileOpen(false);
  };

  // Pruebas ligeras (solo dev)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV === "production") return;
    const msg1 = buildContactMsg({ nombre: "Ana", interes: "KIT2", mensaje: "Hola" });
    console.assert(msg1.includes("\n"), "[TEST] buildContactMsg debe incluir \\n entre líneas");
    const url = WHATSAPP_LINK_BASE(msg1);
    console.assert(url.includes("%0A"), "[TEST] URL de WhatsApp debe contener %0A (newline codificado)");
    console.assert(typeof openKit === "function", "[TEST] openKit debe existir");
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Confetti global */}
      <ConfettiBurst
        show={confetti}
        onComplete={() => {
          if (pendingUrl) window.open(pendingUrl, "_blank");
          setPendingUrl(null);
          setConfetti(false);
        }}
      />

      {/* ===== Navbar responsive (única) ===== */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mt-4 mb-3 rounded-2xl bg-neutral-900/80 backdrop-blur border border-white/10">
            {/* Barra superior */}
            <div className="flex items-center justify-between px-3 py-2">
              {/* Marca */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl">
                  <Gift className="h-5 w-5 text-neutral-900" />
                </div>
                <div className="font-semibold text-white">{BRAND}</div>
              </div>

              {/* Botón menú (solo mobile) */}
              <button
                className="md:hidden inline-flex items-center justify-center rounded-xl text-white/90 hover:text-white p-2"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Abrir menú"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Nav Desktop */}
              <nav className="hidden md:flex items-center gap-1">
                <NavLink label="Inicio" active={page===PAGES.LANDING} onClick={() => go(PAGES.LANDING)} />
                <NavLink label="Kits" active={page===PAGES.KITS || page===PAGES.KIT} onClick={() => go(PAGES.KITS)} />
                <NavLink label="Cómo funciona" active={page===PAGES.HOW} onClick={() => go(PAGES.HOW)} />
                <NavLink label="Historia" active={page===PAGES.ABOUT} onClick={() => go(PAGES.ABOUT)} />
                <NavLink label="Contacto" active={page===PAGES.CONTACT} onClick={() => go(PAGES.CONTACT)} />
                <MBtn
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="ml-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 
                             bg-[#] hover:bg-gradient-to-r hover:from-[#25D366] hover:to-[#128C7E]"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerGo(WHATSAPP_LINK_BASE(`Hola, quiero comprar un kit de ${BRAND}.`));
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" /> Pedir por WhatsApp
                </MBtn>
              </nav>
            </div>

            {/* Panel Mobile */}
            <div
              className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${
                mobileOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-3 pb-3 pt-1">
                <div className="flex flex-col">
                  <button
                    onClick={() => go(PAGES.LANDING)}
                    className={`text-left px-3 py-2 rounded-xl hover:bg-white/10 ${page===PAGES.LANDING ? 'text-white' : 'text-white/80'}`}
                  >
                    Inicio
                  </button>
                  <button
                    onClick={() => go(PAGES.KITS)}
                    className={`text-left px-3 py-2 rounded-xl hover:bg-white/10 ${page===PAGES.KITS || page===PAGES.KIT ? 'text-white' : 'text-white/80'}`}
                  >
                    Kits
                  </button>
                  <button
                    onClick={() => go(PAGES.HOW)}
                    className={`text-left px-3 py-2 rounded-xl hover:bg-white/10 ${page===PAGES.HOW ? 'text-white' : 'text-white/80'}`}
                  >
                    Cómo funciona
                  </button>
                  <button
                    onClick={() => go(PAGES.ABOUT)}
                    className={`text-left px-3 py-2 rounded-xl hover:bg-white/10 ${page===PAGES.ABOUT ? 'text-white' : 'text-white/80'}`}
                  >
                    Historia
                  </button>
                  <button
                    onClick={() => go(PAGES.CONTACT)}
                    className={`text-left px-3 py-2 rounded-xl hover:bg-white/10 ${page===PAGES.CONTACT ? 'text-white' : 'text-white/80'}`}
                  >
                    Contacto
                  </button>

                  {/* Botón WhatsApp destacado en mobile */}
                  <MBtn
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 
                               bg-[#25D366] hover:bg-gradient-to-r hover:from-[#25D366] hover:to-[#128C7E]"
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      triggerGo(WHATSAPP_LINK_BASE(`Hola, quiero comprar un kit de ${BRAND}.`));
                    }}
                  >
                    <Phone className="mr-2 h-4 w-4" /> Pedir por WhatsApp
                  </MBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Páginas con transiciones ===== */}
      <main className="pt-24">
        <AnimatePresence mode="wait">
          {page === PAGES.LANDING && (
            <motion.div key="landing" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <Landing goKits={() => setPage(PAGES.KITS)} goHow={() => setPage(PAGES.HOW)} openKit={openKit} />
            </motion.div>
          )}
          {page === PAGES.KITS && (
            <motion.div key="kits" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <div id="kits-overview"><KitsOverview openKit={openKit} /></div>
            </motion.div>
          )}
          {page === PAGES.KIT && (
            <motion.div key={`kit-${kitPage}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <div id={`kits-${kitPage}`}><KitDetail kitId={kitPage} triggerGo={triggerGo} goKits={() => setPage(PAGES.KITS)} /></div>
            </motion.div>
          )}
          {page === PAGES.ABOUT && (
            <motion.div key="about" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <About />
            </motion.div>
          )}
          {page === PAGES.HOW && (
            <motion.div key="how" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <HowItWorks goKits={() => setPage(PAGES.KITS)} />
            </motion.div>
          )}
          {page === PAGES.CONTACT && (
            <motion.div key="contact" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <Contact triggerGo={triggerGo} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t bg-white">
        <Section className="py-10">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {BRAND}. Hecho con cariño.
          </div>
        </Section>
      </footer>
    </div>
  );
}
