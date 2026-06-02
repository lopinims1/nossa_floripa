import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";

export default function SeguindoPage() {
  return (
    <>
      {/* Desktop: lg+ (≥ 1024px) */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>

      {/* Mobile/Tablet: abaixo de lg */}
      <div className="block lg:hidden">
        <MobileLayout />
      </div>
    </>
  );
}