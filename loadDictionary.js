const { createReadStream } = require("fs");
const { XMLParser } = require("fast-xml-parser");

/**
 * Loads and parses a dictionary from XML file using streams
 * @param {string} filePath - Path to XML dictionary file
 * @returns {Promise<Array>} Array of word objects with definitions and synonyms
 */
async function loadWords(filePath) {
  return new Promise((resolve, reject) => {
    const words = [];

    const fileStream = createReadStream(filePath, {
      highWaterMark: 1024 * 64,
    });

    const parser = new XMLParser({
      parseAttributeValue: true,
      ignoreAttributes: false,
      isArray: (name) => ["entry", "sense", "xr", "innerlink"].includes(name),
    });

    let xmlChunks = "";

    fileStream
      .on("data", (chunk) => {
        xmlChunks += chunk.toString();

        const entryEndIndex = xmlChunks.lastIndexOf("</entry>");
        if (entryEndIndex !== -1) {
          const completeXml = `<root>${xmlChunks.substring(
            0,
            entryEndIndex + 8
          )}</root>`;
          try {
            const result = parser.parse(completeXml);
            if (result.root && result.root.entry) {
              const entries = Array.isArray(result.root.entry)
                ? result.root.entry
                : [result.root.entry];

              for (const entry of entries) {
                if (!entry.form || !entry.form.orth) continue;

                const wordObj = {
                  word: entry.form.orth ? entry.form.orth.trim() : "",
                  hyphenation: entry.form.hyph ? entry.form.hyph.trim() : "",
                  pronunciation: entry.form.pron ? entry.form.pron.trim() : "",
                  definitions: [],
                  synonyms: [],
                };

                if (entry.sense) {
                  const senses = Array.isArray(entry.sense)
                    ? entry.sense
                    : [entry.sense];
                  for (const sense of senses) {
                    if (sense["#text"]) {
                      wordObj.definitions.push(sense["#text"].trim());
                    } else if (sense.def) {
                      const defText =
                        typeof sense.def === "string"
                          ? sense.def
                          : sense.def["#text"] || "";
                      if (defText) wordObj.definitions.push(defText.trim());
                    } else if (sense.gloss) {
                      const glossText =
                        typeof sense.gloss === "string"
                          ? sense.gloss
                          : sense.gloss["#text"] || "";
                      if (glossText) wordObj.definitions.push(glossText.trim());
                    }
                  }
                }

                if (entry.sense) {
                  const senses = Array.isArray(entry.sense)
                    ? entry.sense
                    : [entry.sense];
                  for (const sense of senses) {
                    if (sense.xr) {
                      const xrs = Array.isArray(sense.xr)
                        ? sense.xr
                        : [sense.xr];
                      for (const xr of xrs) {
                        if (xr["@_type"] === "synonymy" && xr.innerlink) {
                          const innerlinks = Array.isArray(xr.innerlink)
                            ? xr.innerlink
                            : [xr.innerlink];

                          for (const innerlink of innerlinks) {
                            if (typeof innerlink === "string") {
                              wordObj.synonyms.push(innerlink.trim());
                            } else if (innerlink["#text"]) {
                              wordObj.synonyms.push(innerlink["#text"].trim());
                            }
                          }
                        }
                      }
                    }
                  }
                }

                if (wordObj.word) {
                  words.push(wordObj);
                }
              }
            }
          } catch (err) {
            console.error("Error parsing XML chunk:", err.message);
          }

          xmlChunks = xmlChunks.substring(entryEndIndex + 8);
        }
      })
      .on("end", () => {
        console.log(`Processed ${words.length} words from dictionary`);
        resolve(words);
      })
      .on("error", reject);
  });
}

module.exports = loadWords;
