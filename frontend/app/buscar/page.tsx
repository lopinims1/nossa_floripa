import BuscarDesktopLayout from "./DesktopLayout";
 
export default function BuscarPage() {
  return (
    <>
      <div className="hidden lg:block"><BuscarDesktopLayout /></div>
      <div className="block lg:hidden"><BuscarDesktopLayout /></div>
    </>
  );
}