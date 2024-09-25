import { Header } from "./components/header/header";

export default function LayoutPomoPro({
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
