import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="bg-orange-500 text-white p-2 rounded-md">
        <span className="font-bold text-xl">AJ</span>
      </div>
      <div className="font-bold text-xl">Agende Já</div>
    </Link>
  )
}

