export default function Nav({ currentView }) {
  return (
    <nav className="flex items-center gap-10 py-10 bg-gray-100 px-4">
      <a href="index.html">
        <h1 className="text-2xl">Song Coder</h1>
      </a>
      <a
        href="songsheetmaker.html"
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
