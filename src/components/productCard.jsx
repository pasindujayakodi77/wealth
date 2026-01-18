import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

export default function ProductCard(props) {
	const product = props.product;
	return (
		<Link to={"/overview/"+product.productId}  className="w-75 h-100 flex flex-col shrink-0 shadow-2xl rounded-2xl overflow-hidden"
			style={{ background: "var(--surface)", borderColor: "var(--border)", borderWidth: "1px", borderStyle: "solid" }}
		>
			<img src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'} className="w-full h-68.75 object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'} />
			<div className="w-full h-31.25  flex flex-col p-0.75">
				<span style={{ color: "var(--text-muted)" }} className="text-[12px]">{product.productId}</span>
				<h1 className="text-lg font-bold">
					{product.name}{" "}
					<span style={{ color: "var(--text-muted)" }} className="text-[14px]">{product.category}</span>
				</h1>
				<div>
					{product.labelledPrice > product.price ? (
						<p>
                            <span className="line-through mr-2.5">LKR {product.labelledPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span>LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </p>
					) : (
						<span>LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
					)}
				</div>
			</div>
		</Link>
	);
}

ProductCard.propTypes = {
    product: PropTypes.shape({
        productId: PropTypes.string.isRequired,
        images: PropTypes.array,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        labelledPrice: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired
    }).isRequired
};