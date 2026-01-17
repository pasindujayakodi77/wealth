import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Loader from "../../components/loader";

const StarRating = ({ rating }) => {
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
};

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews');
                setReviews(response.data);
            } catch (err) {
                setError('Failed to load reviews');
                console.error('Error fetching reviews:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                        {error}
                    </h2>
                    <p style={{ color: "var(--text-secondary)" }}>
                        Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen py-12 px-6 lg:px-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
            >
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl lg:text-5xl font-bold mb-4"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Customer Reviews
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg opacity-80"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        See what our customers are saying about our products
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                                style={{
                                    background: "var(--card-bg)",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-primary)"
                                }}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                                        {review.userId?.firstName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                                            {`${review.userId?.firstName || ''} ${review.userId?.lastName || ''}`.trim() || 'Anonymous'}
                                        </h3>
                                        <p className="text-sm opacity-70" style={{ color: "var(--text-secondary)" }}>
                                            Product ID: {review.productId}
                                        </p>
                                    </div>
                                </div>

                                <StarRating rating={review.rating} />

                                <div className="mt-4 mb-4">
                                    <Quote className="w-6 h-6 opacity-50 mb-2" style={{ color: "var(--text-secondary)" }} />
                                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                     {review.comment}
                                    </p>
                                </div>

                                <div className="text-xs opacity-60" style={{ color: "var(--text-secondary)" }}>
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Star className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: "var(--text-secondary)" }} />
                            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                                No Reviews Yet
                            </h3>
                            <p style={{ color: "var(--text-secondary)" }}>
                                Be the first to leave a review on our products!
                            </p>
                        </div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    {reviews.length > 0 && (
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
                             style={{ background: "var(--accent-bg)", color: "var(--accent-text)" }}>
                            <Star className="w-5 h-5" />
                            <span className="font-medium">Average Rating: {averageRating}/5 ({reviews.length} reviews)</span>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}