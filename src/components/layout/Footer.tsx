export function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-muted)]">
      <div className="mx-auto max-w-[1400px] px-6">
        <span className="font-display">ChuyenTinOJ</span> — mission control cho dân chuyên Tin ·{' '}
        <a href="https://vnoi.info/wiki/" target="_blank" rel="noopener noreferrer">
          VNOI Wiki
        </a>{' '}
        ·{' '}
        <a href="https://cp-algorithms.com" target="_blank" rel="noopener noreferrer">
          CP-Algorithms
        </a>
      </div>
    </footer>
  )
}
