import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../api/products';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ keyword, category, page, pageSize: 12 })
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
        setTotal(res.data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [keyword, category, page]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // newest (default from API)
  });

  const handleCategoryClick = (cat) => {
    setPage(1);
    if (cat === category) {
      setSearchParams(keyword ? { keyword } : {});
    } else {
      setSearchParams(keyword ? { keyword, category: cat } : { category: cat });
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3 mb-4">
          <div className="bg-white rounded-3 p-3 border">
            <h5 className="fw-bold mb-3">Categories</h5>
            <ul className="list-unstyled">
              <li>
                <button
                  className={`btn btn-link text-start p-1 ${!category ? 'fw-bold text-warning' : 'text-dark'}`}
                  onClick={() => handleCategoryClick('')}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`btn btn-link text-start p-1 ${category === cat ? 'fw-bold text-warning' : 'text-dark'}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">
                {keyword ? `Results for "${keyword}"` : category || 'All Products'}
              </h4>
              <small className="text-muted">{total} products found</small>
            </div>
            <select
              className="form-select w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h5>No products found</h5>
              <p className="text-muted">Try a different search or category</p>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {sortedProducts.map((product) => (
                  <div key={product._id} className="col-6 col-lg-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <nav className="mt-4 d-flex justify-content-center">
                  <ul className="pagination">
                    {[...Array(pages)].map((_, i) => (
                      <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
