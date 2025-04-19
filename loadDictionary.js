const fs = require("fs");
const xml2js = require("xml2js");

/**
 * Loads and parses a dictionary from XML file
 * @param {string} filePath - Path to XML dictionary file
 * @returns {Promise<Array>} Array of word objects with definitions and synonyms
 */
async function loadWords(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Dictionary file not found: ${filePath}`);
    }

    const xmlData = fs.readFileSync(filePath, "utf-8");
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);

    if (
      !result.entries ||
      !result.entries.entry ||
      !Array.isArray(result.entries.entry)
    ) {
      throw new Error("Invalid dictionary format");
    }

    const entries = result.entries.entry;
    const words = [];

    for (const entry of entries) {
      try {
        const word = entry.form?.[0]?.orth?.[0]?.trim();
        const pronunciation = entry.form?.[0]?.pron?.[0]?.trim();
        const hyphenation = entry.form?.[0]?.hyph?.[0]?.trim();

        const senses = [];
        const synonyms = new Set(); // Using Set to avoid duplicates

        // Process each sense for definitions and synonyms
        if (entry.sense && Array.isArray(entry.sense)) {
          entry.sense.forEach((s) => {
            // Get definition
            const def = s.def?.[0];
            if (def) {
              let definition;
              if (typeof def === "string") {
                definition = def.trim();
              } else if (typeof def === "object" && def._) {
                definition = def._.trim();
              }

              if (definition) {
                senses.push(definition);
              }
            }

            // Get synonyms
            if (s.xr && Array.isArray(s.xr)) {
              s.xr.forEach((xr) => {
                if (xr.$ && xr.$.type === "synonymy" && xr.innerlink) {
                  xr.innerlink.forEach((link) => {
                    if (typeof link === "string" && link.trim()) {
                      synonyms.add(link.trim());
                    } else if (
                      typeof link === "object" &&
                      link._ &&
                      link._.trim()
                    ) {
                      synonyms.add(link._.trim());
                    }
                  });
                }
              });
            }
          });
        }

        if (word && (senses.length > 0 || synonyms.size > 0)) {
          words.push({
            word,
            pronunciation,
            hyphenation,
            definitions: senses,
            synonyms: Array.from(synonyms),
          });
        }
      } catch (entryError) {
        console.warn(
          `Error processing dictionary entry: ${entryError.message}`
        );
        // Continue processing other entries
      }
    }

    if (words.length === 0) {
      throw new Error("No valid words found in dictionary");
    }

    return words;
  } catch (error) {
    console.error(`Error loading dictionary: ${error.message}`);
    throw error;
  }
}

module.exports = loadWords;
