import ConfigDesktopLayout from "./DesktopLayout";
 
export default function ConfigPage() {
  return (
    <>
      <div className="hidden lg:block"><ConfigDesktopLayout /></div>
      <div className="block lg:hidden"><ConfigDesktopLayout /></div>
    </>
  );
}