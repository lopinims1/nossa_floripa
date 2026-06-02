import CurtidosDesktopLayout from "./DesktopLayout";
 

export default function CurtidosPage() {
  return (
    <>
      <div className="hidden lg:block"><CurtidosDesktopLayout /></div>
      <div className="block lg:hidden"><CurtidosDesktopLayout /></div>
    </>
  );
}