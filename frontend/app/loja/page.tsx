import LojaDesktopLayout from "./DesktopLayout";
 
export default function LojaPage() {
  return (
    <>
      <div className="hidden lg:block"><LojaDesktopLayout /></div>
      <div className="block lg:hidden"><LojaDesktopLayout /></div>
    </>
  );
}