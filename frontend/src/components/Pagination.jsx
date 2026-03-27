export default function Pagination({ page, maxPage, onPageChange }) {
  if (maxPage <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(maxPage, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => onPageChange(1)}>«</button>
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>‹</button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {pages[0] > 2 && <span className="ellipsis">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? "active" : ""}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < maxPage && (
        <>
          {pages[pages.length - 1] < maxPage - 1 && <span className="ellipsis">…</span>}
          <button onClick={() => onPageChange(maxPage)}>{maxPage}</button>
        </>
      )}

      <button disabled={page === maxPage} onClick={() => onPageChange(page + 1)}>›</button>
      <button disabled={page === maxPage} onClick={() => onPageChange(maxPage)}>»</button>
    </div>
  );
}
