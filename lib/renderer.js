/**
 * Renderer class
 *
 * Renders the formatted song body to HTML
 */

import "./styles/styles.scss";

const Renderer = {
  escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  },
  render(songBody) {
    return `
        <div class="songcoder">
            ${songBody
              .map((item) => {
                if (!item.type) return "";

                if (item.type === "break") return "<div></div>";
                else
                  return `
                <div class="songcoder__item ${item.type === "section" ? "songcoder__item--section" : ""}">
                    ${item.type === "section" ? `<div class="songcoder__section">${this.escapeHTML(item.value)}</div>` : ""}

                    <div class="songcoder__item-container">
                        ${
                          item.type === "chord"
                            ? `
                        <div class="songcoder__item-content chord">
                            <div class="chord-value">${item.value ? item.value : "&nbsp;"}</div>

                            ${
                              item.timing
                                ? `
                            <div class="timing">${item.timing}</div>
                            `
                                : ""
                            }
                        </div>
                        `
                            : ""
                        }

                        ${
                          item.type === "symbol" || item.type === "repeat"
                            ? `
                            <span class="songcoder__item-content symbol">${this.escapeHTML(item.value)}</span>
                            `
                            : ""
                        }

                        ${
                          item.type === "comment"
                            ? `
                            <span class="songcoder__item-content comment">${this.escapeHTML(item.value)}</span>
                            `
                            : ""
                        }

                        ${
                          item.type === "label"
                            ? `
                            <span class="songcoder__item-content label">${this.escapeHTML(item.value)}</span>
                            `
                            : ""
                        }

                        ${
                          item.times
                            ? `
                            <span class="songcoder__item-content repeat">x${this.escapeHTML(item.times)}</span>
                            `
                            : ""
                        }

                        ${
                          item.type === "rest"
                            ? `
                            <span class="songcoder__item-content chord">
							    <div class="timing timing--rest">${item.timing}</div>
						    </span>
                            `
                            : ""
                        }
                    </div>
                </div>`;
              })
              .join("")}
        </div>
    `;
  },
};

export default Renderer;
