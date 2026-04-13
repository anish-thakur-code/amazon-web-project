import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, createReview } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadProduct = async () => {
    try {
      const res = await fetchProductById(id);
      setProduct(res.data.product);
    } catch {
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      await createReview(id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      loadProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div className="container py-5 text-center"><h4>Product not found</h4></div>;

  return (
    <div className="container py-4">
      <Link to="/products" className="btn btn-outline-secondary mb-4">
        <i className="fas fa-arrow-left me-2"></i>Back to Products
      </Link>

      <div className="row g-4">
        {/* Product Image */}
        <div className="col-md-5">
          <div className="bg-white rounded-3 p-4 border text-center">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-4">
          <h2 className="fw-bold">{product.name}</h2>
          <StarRating rating={product.rating} numReviews={product.numReviews} />
          <hr />
          <p className="fs-3 fw-bold text-danger">${product.price.toFixed(2)}</p>
          <p className="text-muted">{product.description}</p>
          <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p>
            <strong>Status:</strong>{' '}
            {product.countInStock > 0 ? (
              <span className="text-success fw-bold">In Stock ({product.countInStock} left)</span>
            ) : (
              <span className="text-danger fw-bold">Out of Stock</span>
            )}
          </p>
        </div>

        {/* Add to Cart Box */}
        <div className="col-md-3">
          <div className="cart-summary">
            <p className="fs-4 fw-bold text-danger">${product.price.toFixed(2)}</p>
            <p className="text-muted small">
              {product.countInStock > 0 ? '✅ In Stock' : '❌ Out of Stock'}
            </p>
            {product.countInStock > 0 && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-bold">Quantity</label>
                  <select
                    className="form-select"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-add-cart" onClick={handleAddToCart}>
                  <i className="fas fa-cart-plus me-2"></i>Add to Cart
                </button>
                <Link to="/cart" className="btn btn-outline-secondary w-100 mt-2">
                  View Cart
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="row mt-5">
        <div className="col-md-8">
          <h4 className="fw-bold mb-4">Customer Reviews</h4>

          {product.reviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first to review!</p>
          ) : (
            product.reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-3 p-3 mb-3 border">
                <div className="d-flex justify-content-between">
                  <strong>{review.name}</strong>
                  <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
                <StarRating rating={review.rating} />
                <p className="mb-0 mt-1">{review.comment}</p>
              </div>
            ))
          )}

          {/* Write Review */}
          {user ? (
            <div className="bg-white rounded-3 p-4 border mt-4">
              <h5 className="fw-bold mb-3">Write a Review</h5>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <select
                    className="form-select"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    placeholder="Share your experience..."
                  />
                </div>
                <button type="submit" className="btn btn-warning fw-bold" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          ) : (
            <p className="mt-3">
              <Link to="/login">Sign in</Link> to write a review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
