import { Header } from "./components/header/header";

export default async function LayoutPomoPro({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="p-6">{children}</main>
    </div>
  );
}
