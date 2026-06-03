import { Suspense } from "react";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";

export default function SeguindoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
      <div className="block lg:hidden">
        <MobileLayout />
      </div>
    </Suspense>
  );
}