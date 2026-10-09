export default function Nav({ currentView }) {
  return (
    <nav className="flex items-center gap-10 py-2 bg-black text-white px-4 print:hidden">
      <a href="index.html">
        <h1 className="text-2xl">&lt; Song Coder &gt;</h1>
      </a>
      <a
        href="song-sheet-maker.html"
        className={`${currentView === "song-sheet-maker" ? "border-b-2" : ""}`}
      >
        Song Sheet Maker
      </a>
      <a
        href="syntax.html"
        className={`${currentView === "syntax" ? "border-b-2" : ""}`}
      >
        Syntax Guide
      </a>
    </nav>
  );
}
