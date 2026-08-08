function ProductSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img shimmer"></div>
      <div className="skeleton-body">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-line shimmer"></div>
        <div className="skeleton-price shimmer"></div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
