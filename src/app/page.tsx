import Image from "next/image";

export default function Home() {
  return (
    <div className="container">
      <Image
        src="/images/nextjs.png"
        alt="Next.js logo"
        width={500}
        height={500}
      />
      <h1 className="title">Welcome to Next.js</h1>
      <p className="description">
        Get started by editing <code>pages/index.js</code>
      </p>
    </div>
  );
}
