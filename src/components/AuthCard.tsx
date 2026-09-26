export function AuthCard({ titulo, subtitulo, children }: { titulo: string; subtitulo: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="container-loja flex justify-center py-16">
      <div className="card w-full max-w-md p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/marca/simbolo.svg" alt="" className="h-12 w-12" />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">{titulo}</h1>
        <p className="mt-1 text-sm text-gray-500">{subtitulo}</p>
        {children}
      </div>
    </div>
  )
}
