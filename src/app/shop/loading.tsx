export default function ShopLoading() {
  return <main className="shop-layout loading-page"><div className="skeleton skeleton-heading" /><div className="shop-grid">{Array.from({ length: 6 }, (_, index) => <div className="skeleton skeleton-card" key={index} />)}</div></main>;
}
