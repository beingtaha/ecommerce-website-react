import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/products/${id}`);

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();
      setProduct(data);
      setSelectedImage(data.thumbnail);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category,
        brand: product.brand,
        discountPercentage: product.discountPercentage || 0,
      };

      for (let i = 0; i < quantity; i++) {
        addToCart(productToAdd);
      }
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="details-error">
        <h2>Product Not Found</h2>
        <p>{error || "The product you are looking for does not exist."}</p>
        <Link to="/products" className="back-btn">
          Back to Products
        </Link>
      </div>
    );
  }

  const reviewsCount = product.reviews
    ? Array.isArray(product.reviews)
      ? product.reviews.length
      : 0
    : 0;

  return (
    <div className="product-details-container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/products">Products</Link> &gt;
        <span>{product.title}</span>
      </div>

      <div className="product-details-wrapper">
        <div className="product-images-section">
          <div className="main-image">
            <img src={selectedImage} alt={product.title} />
          </div>

          <div className="thumbnail-images">
            {product.images &&
              product.images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    selectedImage === img ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.title} ${index + 1}`} />
                </div>
              ))}
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.title}</h1>

          <div className="product-meta">
            <span className="category">{product.category}</span>
            <span className="brand">Brand: {product.brand}</span>
            <div className="rating">
              <span className="stars">
                {"★".repeat(Math.floor(product.rating))}
                {"☆".repeat(5 - Math.floor(product.rating))}
              </span>
              <span className="rating-value">{product.rating} / 5</span>
              <span className="reviews">({reviewsCount} reviews)</span>
            </div>
          </div>

          <div className="product-price-section">
            <div className="current-price">
              <span className="price">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="discount-badge">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {product.discountPercentage > 0 && (
              <div className="original-price">
                <span className="label">Original Price:</span>
                <span className="price">
                  $
                  {(
                    product.price /
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </span>
              </div>
            )}

            <div className="stock-status">
              <span
                className={`status ${
                  product.stock > 0 ? "in-stock" : "out-of-stock"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="product-specs">
                <h3>Specifications</h3>
                <ul>
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {product.reviews &&
            Array.isArray(product.reviews) &&
            product.reviews.length > 0 && (
              <div className="product-reviews">
                <h3>Customer Reviews</h3>
                <div className="reviews-list">
                  {product.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <span className="reviewer">{review.reviewerName}</span>
                        <span className="review-rating">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <span className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="purchase-section">
            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={increaseQuantity}>
                +
              </button>
            </div>

            <div className="action-buttons">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              <button className="buy-now-btn">Buy Now</button>
            </div>
          </div>

          <div className="additional-info">
            <div className="info-item">
              <span className="icon">🚚</span>
              <div>
                <strong>Free Delivery</strong>
                <p>Delivery in 3-5 business days</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">🔄</span>
              <div>
                <strong>30-Day Returns</strong>
                <p>Easy returns within 30 days</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">🛡️</span>
              <div>
                <strong>Warranty</strong>
                <p>1 year manufacturer warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="back-to-products">
        <Link to="/products" className="back-link">
          ← Back to All Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
