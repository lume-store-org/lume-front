export function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="container-store flex flex-col items-center justify-between gap-3 py-8 text-sm text-gray-500 sm:flex-row">
        <p className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marca/simbolo.svg" alt="" className="h-5 w-5" />
          <span>
            <span className="font-semibold text-ink">Lume Store</span> · tecnologia e estilo num só lugar
          </span>
        </p>
        <p>© {new Date().getFullYear()} Lume Store</p>
      </div>
    </footer>
  )
}
