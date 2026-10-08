import Parser from "./parser";
import Formatter from "./formatter";
import Renderer from "./renderer";

export const generateChordSheet = (sourceCode, key, newKey) => {
  const parsedSong = Parser.parse(sourceCode, key, newKey);
  const formattedSong = Formatter.format(parsedSong);
  return Renderer.render(formattedSong);
};

export const keys = Parser.keys;
