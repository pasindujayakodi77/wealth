import axios from "axios";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Package, ShieldCheck, Sparkles, Star, Truck, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Loader from "../components/loader";

const heroImages = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80",
    "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=900&q=80",
];

const MotionSection = motion.section;

function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % heroImages.length);
        }, 4200);
        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className="relative aspect-4/5 w-full overflow-hidden rounded-3xl"
            style={{ background: "var(--overlay-bg)", borderColor: "var(--overlay-border)", borderWidth: "1px", borderStyle: "solid" }}
        >
            {heroImages.map((img, i) => (
                <motion.img
                    key={img}
                    src={img}
                    alt="Footwear highlight"
                    className="absolute inset-0 h-full w-full object-cover grayscale"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: i === current ? 1 : 0, scale: i === current ? 1 : 1.05 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                />
            ))}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                {heroImages.map((_, i) => (
                    <motion.div
                        key={i}
                        className="h-1.5 rounded-full"
                        style={{ background: "var(--overlay-text)", opacity: i === current ? 0.9 : 0.35, backdropFilter: "blur(4px)" }}
                        initial={{ width: 22 }}
                        animate={{ width: i === current ? 42 : 22 }}
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </div>
        </div>
    );
}

function ProductTile({ product, delay = 0, onClick }) {
    const displayImage = product.images?.[0] || product.image || "https://via.placeholder.com/600x600?text=No+Image";
    const price = product.price ?? product.labelledPrice ?? 0;
    const tag = product.tag || product.category || "Featured";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.45 }}
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden rounded-2xl backdrop-blur-xl cursor-pointer"
            style={{ borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid", background: "var(--surface)" }}
            onClick={onClick}
        >
            <div className="relative aspect-square overflow-hidden">
                <motion.img
                    src={displayImage}
                    alt={product.name}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--surface)", color: "var(--text-primary)" }}>{tag}</span>
                </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
                <div>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>{product.productId || "ID"}</p>
                    <h3 className="text-xl font-semibold leading-tight">{product.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-lg font-bold">LKR {Number(price).toFixed(2)}</span>
                    {product.labelledPrice && product.labelledPrice > price ? (
                        <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>LKR {Number(product.labelledPrice).toFixed(2)}</span>
                    ) : null}
                </div>
            </div>
            <motion.div
                className="absolute inset-0 opacity-0"
                style={{ background: "linear-gradient(to right, var(--overlay-bg), transparent, var(--overlay-bg))" }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
}

ProductTile.propTypes = {
    product: PropTypes.object.isRequired,
    delay: PropTypes.number,
    onClick: PropTypes.func.isRequired,
};

export default function HomePage() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

    const y = useTransform(scrollYProgress, [0, 1], [0, 280]);
    const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
    const ySpring = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productError, setProductError] = useState("");
    const [reviewsStats, setReviewsStats] = useState({ count: 0, average: 0 });

    useEffect(() => {
        let ignore = false;

        async function fetchFeaturedProducts() {
            setLoadingProducts(true);
            setProductError("");
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
                if (!ignore) {
                    const products = Array.isArray(res.data) ? res.data : [];
                    const spotlightProducts = products.filter(product => product.isSpotlight);
                    setFeaturedProducts(spotlightProducts);
                }
            } catch (error) {
                if (!ignore) {
                    setProductError(error?.response?.data?.message || "Failed to load featured products.");
                }
            } finally {
                if (!ignore) {
                    setLoadingProducts(false);
                }
            }
        }

        fetchFeaturedProducts();
        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        async function fetchReviewsStats() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`);
                const reviews = res.data;
                const count = reviews.length;
                const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
                setReviewsStats({ count, average });
            } catch (error) {
                console.error("Failed to fetch reviews stats", error);
            }
        }
        fetchReviewsStats();
    }, []);

    const displayProducts = featuredProducts;

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
            <div className="pointer-events-none absolute inset-0 -z-10">
                <motion.div
                    className="absolute left-1/4 top-0 h-96 w-96 rounded-full blur-3xl"
                    style={{ background: "var(--overlay-bg)" }}
                    animate={{ x: [0, 90, 0], y: [0, 60, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full blur-3xl"
                    style={{ background: "var(--overlay-bg)" }}
                    animate={{ x: [0, -90, 0], y: [0, 110, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                />
                <div
                    className="absolute inset-0"
                    style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--overlay-border) 1px, transparent 0)", backgroundSize: "40px 40px" }}
                />
            </div>

            <MotionSection style={{ y: ySpring, opacity, scale }} className="relative flex min-h-screen items-center px-6 pt-20 lg:px-12">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-sm"
                                style={{ borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid", background: "var(--surface)" }}
                            >
                                <Sparkles size={16} style={{ color: "var(--text-primary)" }} />
                                <span className="text-sm font-medium">New Capsule / 2026</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Step Into
                                <br />
                                <span className="italic" style={{ color: "var(--text-muted)" }}>Tomorrow</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="max-w-xl text-lg"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Premium craftsmanship meets adaptive tech. Breathable uppers, balanced cushioning, and silhouettes tuned for coastal heat and city miles.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                                className="flex flex-wrap gap-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => navigate("/products")}
                                    className="group relative overflow-hidden rounded-full px-8 py-4 text-lg font-semibold"
                                    style={{ background: "var(--surface)", color: "var(--text-primary)", borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid" }}
                                >
                                    <motion.div className="absolute inset-0" style={{ background: "var(--surface-soft)" }} initial={{ x: "100%" }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
                                    <span className="relative flex items-center gap-2">
                                        Shop Now
                                        <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                                    </span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "var(--overlay-bg)" }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => navigate("/products")}
                                    className="rounded-full px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all"
                                    style={{ borderColor: "var(--border)", borderWidth: "2px", borderStyle: "solid", color: "var(--text-primary)", background: "var(--surface)" }}
                                >
                                    Explore Collection
                                </motion.button>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="flex items-center gap-8 pt-3">
                                <div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < Math.floor(reviewsStats.average) ? "fill-current" : ""} style={{ color: "var(--text-primary)" }} />
                                        ))}
                                    </div>
                                    <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{reviewsStats.count > 0 ? `${reviewsStats.count}+ happy runners` : '100+ happy runners'}</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative"
                        >
                            <motion.div
                                animate={{ rotate: [0, 4, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative overflow-hidden rounded-3xl"
                                style={{ borderColor: "var(--overlay-border)", borderWidth: "1px", borderStyle: "solid", boxShadow: "0 18px 48px rgba(0,0,0,0.08)" }}
                            >
                                <HeroSlider />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                whileHover={{ scale: 1.05, y: -6 }}
                                className="absolute -left-6 -bottom-6 rounded-2xl p-4 backdrop-blur-xl shadow-xl"
                                style={{ borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid", background: "var(--surface)" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "var(--surface)" }}>
                                        <ShieldCheck size={24} style={{ color: "var(--text-primary)" }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Verified Quality</p>
                                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Lab-tested cushioning</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                whileHover={{ scale: 1.05, y: -6 }}
                                className="absolute -right-6 -top-6 rounded-2xl p-4 backdrop-blur-xl shadow-xl"
                                style={{ borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid", background: "var(--surface)" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "var(--surface)" }}>
                                        <Zap size={24} style={{ color: "var(--text-primary)" }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Fast Dispatch</p>
                                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>3-day delivery</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </MotionSection>

            <section className="relative px-6 py-20 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid gap-6 md:grid-cols-3"
                    >
                        {[
                            { icon: Truck, title: "Free Shipping", desc: "On local orders over 5000LKR" },
                            { icon: Package, title: "Easy Returns", desc: "30-day return window" },
                            { icon: ShieldCheck, title: "Secure Checkout", desc: "Protected and verified" },
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl"
                                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                            >
                                <motion.div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "var(--surface-soft)", zIndex: -1 }} />
                                <feature.icon size={36} className="mb-4" style={{ color: "var(--text-primary)" }} />
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                                <p className="mt-2" style={{ color: "var(--text-muted)" }}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="relative px-6 py-20 lg:px-12" id="featured">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.32em]" style={{ color: "var(--text-muted)" }}>Featured</p>
                        <h2 className="mt-2 text-4xl font-semibold">This Week&apos;s Spotlight</h2>
                        <p style={{ color: "var(--text-muted)" }}>Handpicked silhouettes tuned for speed, trail, and city.</p>
                    </div>
                    <Link to="/products" className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                        View catalog
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {loadingProducts ? (
                    <div className="flex w-full justify-center py-16">
                        <Loader />
                    </div>
                ) : productError ? (
                    <p className="mt-8" style={{ color: "var(--text-muted)" }}>{productError}</p>
                ) : displayProducts.length === 0 ? (
                    <div className="mt-10 text-center">
                        <p style={{ color: "var(--text-muted)" }}>No spotlight products this week. Check back soon!</p>
                    </div>
                ) : (
                    <div className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {displayProducts.map((product, i) => (
                            <ProductTile 
                                key={product.productId || product.id || i} 
                                product={product} 
                                delay={i * 0.08}
                                onClick={() => navigate(`/overview/${product.productId}`)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="relative px-6 py-20 lg:px-12">
                <div className="mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl p-12 backdrop-blur-xl"
                        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                    >
                        <motion.div
                            className="absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl"
                            style={{ background: "var(--overlay-bg)" }}
                            animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.18, 0.12] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                        <div className="relative z-10 text-center">
                            <h2 className="text-4xl font-bold lg:text-5xl">Join Our Exclusive Club</h2>
                            <p className="mt-4 text-lg" style={{ color: "var(--text-muted)" }}>Early access to drops, concierge fit guidance, and priority shipping — tailored to how you move.</p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => navigate("/register")}
                                    className="rounded-full px-8 py-4 text-lg font-semibold"
                                    style={{ background: "var(--surface)", color: "var(--text-primary)", borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid" }}
                                >
                                    Sign Up Now
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "var(--overlay-bg)" }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => navigate("/login")}
                                    className="rounded-full px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                                    style={{ borderColor: "var(--border)", borderWidth: "2px", borderStyle: "solid", color: "var(--text-primary)", background: "var(--surface)" }}
                                >
                                    Sign In
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
