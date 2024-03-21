export type Csv = {
  header: string[];
  data: string[][];
};

export const CRLF = "\r\n";
export const LF = "\n";
export const CR = "\r";
export const newLine = LF;
export const newLineRegExp = /\r?\n|\r/g;

export const fromCsvText = (header: string[], text: string): Csv => {
  const rows = parseLines(text);

  if (rows.length < 2) {
    return { header, data: [] };
  }

  const headerRow = rows[0];

  return {
    header,
    data: rows
      .slice(1)
      .filter((s) => s.length > 0)
      .map((row) => {
        return header.map((key) => {
          const index = headerRow.indexOf(key);
          return row[index] ?? "";
        });
      }),
  };
};

// parsing csv text supporting following cases
// multi-line cell with quotes ex) "a\nb"
// comma in cell with quotes ex) "a,b"
// cell without quotes ex) a,b
// cell with quotes ex) "a","b"
const parseLines = (text: string): string[][] => {
  const rows = text.split(newLineRegExp);
  const lists = [] as string[][];

  let isInQuotes = false;
  let list = [] as string[];

  // split with new line
  for (let j = 0; j < rows.length; j++) {
    // start of line
    if (!isInQuotes) {
      list = [];
    }

    // if empty line, then skip
    if (!isInQuotes && rows[j] === "") {
      continue;
    }

    const split = rows[j].split(",");

    // split with comma
    for (let i = 0; i < split.length; i++) {
      let cell = split[i];

      // count quotes
      const quotes = cell.match(/"/g) || [];

      // if there are two quotes, then it's a single cell
      if (quotes.length === 2) {
        // trim space and quotes
        list.push(cell.trim().replace(/"/g, ""));

        continue;
      }

      // if there are one quote and in quotes, then end of cell
      if (quotes.length === 1 && isInQuotes) {
        // end quoting
        isInQuotes = false;

        // trim space behind end quote
        cell = cell.replace(/"\s*$/, "");

        // cell variable is split by comma, so you have to join them with comma when ending quote
        list[list.length - 1] = list[list.length - 1] + (i !== 0 ? "," : "") + cell;

        continue;
      }

      // if there are one quote and not in quotes, then start of cell
      if (quotes.length === 1 && !isInQuotes) {
        // start quoting
        isInQuotes = true;

        // trim space before start quote
        cell = cell.replace(/^\s*"/, "");

        list.push(cell);

        continue;
      }

      // if there are no quotes and in quotes, then middle of cell
      if (isInQuotes) {
        // cell variable is split by comma, so you have to join them with comma in the middle of quoting
        list[list.length - 1] = list[list.length - 1] + (rows[j].length === 1 ? "," : "") + cell;

        continue;
      }

      // if there are no quotes and not in quotes, then just single cell without quotes
      if (!isInQuotes) {
        list.push(cell);
      }
    }

    // if in quotes, then it's a multi-line cell
    if (isInQuotes) {
      // quoting is not ended, so it's a multi-line cell
      list[list.length - 1] = list[list.length - 1] + "\n";

      // if not in quotes, then it's a new row
    } else {
      lists.push(list);
    }
  }

  return lists;
};
