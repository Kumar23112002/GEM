import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const queryParam = searchParams.get('q') || '';
  const catParam = searchParams.get('cat') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(catParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [maxPrice, setMaxPrice] = useState(400000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get('cat') || 'all');
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search term match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchCat = (p.categoryName || '').toLowerCase().includes(q);
          const matchDesc = (p.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchCat && !matchDesc) return false;
        }

        // Category match
        if (selectedCategory !== 'all') {
          if (p.category !== selectedCategory) return false;
        }

        // Price match
        if (p.price > maxPrice) return false;

        // Rating match
        if (minRating > 0 && p.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return a.id - b.id; // featured default
      });
  }, [products, searchQuery, selectedCategory, maxPrice, minRating, sortBy]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat === 'all') next.delete('cat');
      else next.set('cat', cat);
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(400000);
    setMinRating(0);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.lightBg }}>
      <Navbar />

      {/* Breadcrumbs */}
      <div className="border-bottom py-2 bg-white" style={{ borderColor: colors.border }}>
        <div className="container small text-muted">
          <Link to="/" className="text-decoration-none text-muted">Home</Link>
          <span className="mx-2">›</span>
          <span style={{ color: colors.darkBlue }}>Catalog & Search</span>
          {searchQuery && (
            <>
              <span className="mx-2">›</span>
              <span className="fw-semibold text-success">"{searchQuery}"</span>
            </>
          )}
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Desktop Filter Sidebar */}
          <aside className="col-12 col-lg-3 d-none d-lg-block">
            <div className="card border-0 shadow-sm rounded-3 p-4" style={{ backgroundColor: colors.white }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h5 className="fw-bold mb-0" style={{ color: colors.darkBlue, fontSize: '16px' }}>
                  <i className="fas fa-sliders-h me-2 text-success"></i> Filters
                </h5>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-link text-decoration-none p-0 small text-danger"
                >
                  Reset All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2 small text-uppercase" style={{ color: colors.textDark }}>
                  Categories
                </h6>
                <div className="d-flex flex-column gap-1">
                  {[
                    { id: 'all', label: 'All Products' },
                    { id: 'retail', label: 'Retail Products (Fixed Price)' },
                    { id: 'soft', label: 'Soft Commodities (RFQ)' },
                    { id: 'hard', label: 'Hard Commodities (RFQ)' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`btn btn-sm text-start border-0 py-2 px-2 rounded-2 ${
                        selectedCategory === cat.id ? 'fw-bold' : 'text-muted'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === cat.id ? colors.primarySubtle : 'transparent',
                        color: selectedCategory === cat.id ? colors.primary : colors.textBody,
                        fontSize: '13px',
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="fw-bold mb-0 small text-uppercase" style={{ color: colors.textDark }}>
                    {selectedCategory === 'soft' || selectedCategory === 'hard' ? 'Max Target Budget' : 'Max Price'}
                  </h6>
                  <span className="small fw-bold" style={{ color: colors.primary }}>
                    ₹{maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="50"
                  max="400000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted small" style={{ fontSize: '11px' }}>
                  <span>₹50</span>
                  <span>₹4,00,000</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2 small text-uppercase" style={{ color: colors.textDark }}>
                  Minimum Rating
                </h6>
                <div className="d-flex flex-column gap-2 small">
                  {[4, 3, 2].map((r) => (
                    <label key={r} className="d-flex align-items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === r}
                        onChange={() => setMinRating(r)}
                        className="form-check-input"
                      />
                      <span>{r} Stars & above</span>
                    </label>
                  ))}
                  <label className="d-flex align-items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="form-check-input"
                    />
                    <span>All ratings</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Products Grid */}
          <main className="col-12 col-lg-9">
            {/* Control Bar */}
            <div
              className="card border-0 shadow-sm rounded-3 p-3 mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3"
              style={{ backgroundColor: colors.white }}
            >
              <div>
                <h5 className="fw-bold mb-0" style={{ color: colors.darkBlue, fontSize: '18px' }}>
                  {filteredProducts.length} Results Found
                </h5>
                <span className="small text-muted">
                  Showing verified items matching your trade criteria
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between justify-content-sm-end w-100 w-sm-auto gap-2">
                {/* Mobile Filter Toggle */}
                <button
                  type="button"
                  className="btn btn-outline-secondary d-lg-none btn-sm text-nowrap"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                >
                  <i className="fas fa-filter me-1"></i> Filter
                </button>

                {/* Sort selector */}
                <div className="d-flex align-items-center gap-2 flex-grow-1 flex-sm-grow-0">
                  <span className="small text-muted d-none d-sm-inline text-nowrap">Sort by:</span>
                  <select
                    className="form-select form-select-sm shadow-none w-100"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ minWidth: '140px', borderColor: colors.border }}
                  >
                    <option value="featured">Featured / Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
              <div
                className="card border-0 shadow-sm rounded-3 p-3 mb-4 d-lg-none"
                style={{ backgroundColor: colors.surfaceBg }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Refine Search</h6>
                  <button
                    type="button"
                    className="btn btn-close btn-sm shadow-none"
                    onClick={() => setMobileFilterOpen(false)}
                  ></button>
                </div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {[
                    { id: 'all', label: 'ALL' },
                    { id: 'retail', label: 'RETAIL' },
                    { id: 'soft', label: 'SOFT (RFQ)' },
                    { id: 'hard', label: 'HARD (RFQ)' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCategorySelect(c.id)}
                      className={`btn btn-sm ${selectedCategory === c.id ? 'btn-success text-white' : 'btn-white'}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="mb-2">
                  <label className="small fw-semibold">Max Price: ₹{maxPrice.toLocaleString()}</label>
                  <input
                    type="range"
                    className="form-range"
                    min="50"
                    max="400000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-success btn-sm w-100 mt-2"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2 text-muted small">Loading marketplace catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div
                className="card border-0 shadow-sm rounded-3 p-5 text-center"
                style={{ backgroundColor: colors.white }}
              >
                <i className="fas fa-search fs-1 text-muted mb-3"></i>
                <h4 className="fw-bold mb-2" style={{ color: colors.darkBlue }}>
                  No Products Match Your Criteria
                </h4>
                <p className="text-muted small mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  Try adjusting your filters, clearing your search query, or checking commodity categories.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-success px-4 py-2"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="col">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
