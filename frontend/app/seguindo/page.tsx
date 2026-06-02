import SeguindoDesktopLayout from "./DesktopLayout";

export default function SeguindoPage() {
  return (
    <>
      <div className="hidden lg:block"><SeguindoDesktopLayout /></div>
      <div className="block lg:hidden"><SeguindoDesktopLayout /></div>
    </>
  );
}