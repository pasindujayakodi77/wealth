import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import ProductCard from "../components/productCard";
import ImageSlider from "../components/imageSlider";

const heroImages = [
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
];

const categoryHighlights = [
    {
        title: "Urban Classics",
        description: "Structured uppers built for long commutes and rooftop sunsets.",
        color: "from-[#10172b] via-[#131a2f] to-[#0c1021]",
    },
    {
        title: "Performance Run",
        description: "Breathable knit, stride-stable frames, zero distraction.",
        color: "from-[#0f1c2d] via-[#19314f] to-[#0d1a30]",
    },
    {
        title: "Trail Essentials",
        description: "Grip-first builds tuned for wet sand and misty peaks.",
        color: "from-[#14130f] via-[#1f2018] to-[#0d0d09]",
    },
];

const sellingPoints = [
    {
        title: "2-day delivery",
        description: "Priority shipping on every local order.",
        icon: Truck,
    },
    {
        title: "Verified quality",
        description: "Lab-tested cushioning and stitch work.",
        icon: ShieldCheck,
    },
    {
        title: "New drops weekly",
        description: "Limited capsules hand-picked by stylists.",
        icon: Sparkles,
    },
];

const brandStats = [
    { label: "Pairs delivered", value: "120K+", subtext: "since 2020" },
    { label: "Cities served", value: "37", subtext: "across the island" },
    { label: "Return rate", value: "1.4%", subtext: "lowest in class" },
];

const badges = ["Humidity-ready builds", "Concierge fit support", "Ethically sourced" ];

const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const floatCard = {
    rest: { y: 0, scale: 1, opacity: 0.96 },
    hover: { y: -8, scale: 1.01, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 16 } },
};

export default function HomePage() {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productError, setProductError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function fetchFeaturedProducts() {
            setLoadingProducts(true);
            setProductError("");
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products");
                if (!ignore) {
                    const list = Array.isArray(res.data) ? res.data.slice(0, 4) : [];
                    setFeaturedProducts(list);
                    setLoadingProducts(false);
                }
            } catch (error) {
                if (!ignore) {
                    setProductError(error?.response?.data?.message || "Failed to load featured products.");
                    setLoadingProducts(false);
                }
            }
        }

        fetchFeaturedProducts();

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div className="relative overflow-hidden bg-[#030712] text-white">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.14),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.13),transparent_28%),radial-gradient(circle_at_50%_70%,rgba(124,58,237,0.12),transparent_30%)]" />

            <section className="relative max-w-6xl mx-auto px-6 lg:px-12 pt-14 pb-20 lg:pt-20 lg:pb-28">
                <div className="absolute inset-x-10 top-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
                >
                    <motion.div variants={fadeUp} className="space-y-6">
                        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-white/60">
                            {badges.map((badge) => (
                                <motion.span
                                    key={badge}
                                    variants={fadeUp}
                                    className="rounded-full border border-white/20 px-4 py-2 bg-white/5 backdrop-blur"
                                >
                                    {badge}
                                </motion.span>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-white/60">new capsule // drop 07</p>
                            <h1 className="text-4xl leading-tight font-semibold sm:text-5xl">
                                Footwear engineered for warm nights, salt air, and restless city miles.
                            </h1>
                            <p className="text-lg text-white/70">
                                Discover breathable uppers, adaptive cushioning, and silhouettes curated for Sri Lanka's pace. Every pair is tuned to move between misty highlands and coastal heat.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/products")}
                                className="inline-flex items-center gap-2 rounded-full bg-white text-[#05060a] px-6 py-3 font-semibold shadow-lg shadow-blue-500/20"
                            >
                                Shop new arrivals
                                <ArrowRight size={18} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/products")}
                                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-white/90"
                            >
                                Browse full catalog
                            </motion.button>
                        </div>
                        <motion.div
                            variants={stagger}
                            className="grid grid-cols-1 gap-6 sm:grid-cols-3"
                        >
                            {brandStats.map((stat) => (
                                <motion.div
                                    key={stat.label}
                                    variants={fadeUp}
                                    className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur"
                                >
                                    <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
                                    <p className="text-xs text-white/50">{stat.subtext}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        className="relative rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur"
                    >
                        <div className="absolute inset-x-6 top-6 h-10 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-transparent blur-2xl" />
                        <ImageSlider images={heroImages} />
                        <div className="absolute -left-10 bottom-10 hidden h-24 w-24 rounded-full bg-blue-500/30 blur-3xl lg:block" />
                        <div className="absolute -right-10 top-10 hidden h-24 w-24 rounded-full bg-emerald-400/30 blur-3xl lg:block" />
                    </motion.div>
                </motion.div>
            </section>

            <section className="max-w-6xl mx-auto px-6 lg:px-12 pb-14">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={stagger}
                    className="grid gap-6 md:grid-cols-3"
                >
                    {sellingPoints.map((point) => {
                        const Icon = point.icon;
                        return (
                            <motion.div
                                key={point.title}
                                variants={fadeUp}
                                whileHover="hover"
                                initial="rest"
                                animate="rest"
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur"
                            >
                                <motion.div variants={floatCard}>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/80 to-cyan-400/80 text-white">
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-semibold">{point.title}</h3>
                                    <p className="mt-2 text-sm text-white/70">{point.description}</p>
                                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            <section className="max-w-6xl mx-auto px-6 lg:px-12 py-6 lg:py-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="flex flex-wrap items-center justify-between gap-4"
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-white/50">curated edits</p>
                        <h2 className="mt-2 text-3xl font-semibold">Shop by mood</h2>
                        <p className="text-sm text-white/60">Collections built for how you move: sprint, wander, or escape.</p>
                    </div>
                    <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => navigate("/products")}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80"
                    >
                        Explore all
                        <ArrowRight size={18} />
                    </motion.button>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={stagger}
                    className="mt-8 grid gap-6 md:grid-cols-3"
                >
                    {categoryHighlights.map((category) => (
                        <motion.div
                            key={category.title}
                            variants={fadeUp}
                            whileHover="hover"
                            initial="rest"
                            animate="rest"
                            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.color} p-6 shadow-xl`}
                        >
                            <motion.div variants={floatCard}>
                                <p className="text-xs uppercase tracking-[0.28em] text-white/70">collection</p>
                                <h3 className="mt-2 text-2xl font-semibold">{category.title}</h3>
                                <p className="mt-2 text-sm text-white/80">{category.description}</p>
                                <motion.button
                                    whileHover={{ x: 6 }}
                                    onClick={() => navigate("/products")}
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white"
                                >
                                    Shop the drop
                                    <ArrowRight size={16} />
                                </motion.button>
                            </motion.div>
                            <div className="absolute -right-6 -bottom-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <section className="max-w-6xl mx-auto px-6 lg:px-12 py-14" id="featured">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="flex flex-wrap items-center justify-between gap-4"
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-white/50">featured</p>
                        <h2 className="mt-2 text-3xl font-semibold">This week's spotlight</h2>
                    </div>
                    <Link to="/products" className="inline-flex items-center gap-2 text-sm text-white/80">
                        View catalog
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>

                {loadingProducts ? (
                    <div className="flex w-full justify-center py-12">
                        <Loader />
                    </div>
                ) : productError ? (
                    <p className="mt-6 text-red-400">{productError}</p>
                ) : featuredProducts.length === 0 ? (
                    <p className="mt-6 text-white/60">Fresh arrivals are being styled. Check back tomorrow.</p>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                        className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
                    >
                        {featuredProducts.map((product) => (
                            <motion.div key={product.productId} variants={fadeUp} whileHover={{ y: -6 }}>
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>

            <section className="max-w-6xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0b0f1c] via-[#0c1424] to-[#0c182a] p-10 lg:p-14 shadow-2xl"
                >
                    <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent" />
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-xl space-y-3">
                            <p className="text-xs uppercase tracking-[0.32em] text-white/50">member exclusive</p>
                            <h2 className="text-3xl font-semibold">Unlock early drops and concierge fit guidance.</h2>
                            <p className="text-white/70">
                                Create an account to reserve limited stock before it hits the shelf. Personal size tuning, 2-day delivery, and early access alerts await.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/register")}
                                className="rounded-full bg-white px-6 py-3 font-semibold text-[#05060a] shadow-lg"
                            >
                                Join the club
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/login")}
                                className="rounded-full border border-white/25 px-6 py-3 text-white/90"
                            >
                                Sign in
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}