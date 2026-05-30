import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-5 bg-zinc-50 font-sans dark:bg-black">
      <h1>
        <Link href="/login">Login</Link>
      </h1>

      <h1>
        <Link href="/register">Register</Link>
      </h1>
    </div>
  );
}
