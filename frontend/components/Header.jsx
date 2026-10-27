import GoogleSheetsConnector from "./GoogleSheetsConnector";

export default function Header({ currentView }) {
  return (
    <header
      className="flex items-center gap-10 py-2 bg-gradient-to-b from-[#245dd7] via-[#0e48d1] to-[#1a4dc6] border-t border-[#6699ff] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]
 text-white px-4 print:hidden"
    >
      <div className="flex items-center gap-10">
        <h1 className="text-2xl">🎼 Song Coder</h1>
        <a href="syntax.html" className="btn" target="_blank">
          🤓 Syntax Guide
        </a>
      </div>

      <div className="flex justify-end grow">
        <GoogleSheetsConnector />
      </div>
    </header>
  );
}
