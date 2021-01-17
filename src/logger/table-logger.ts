import moment from 'moment';
import fs from 'fs';
import { DEFAULT_COLUMN_PADDING } from './constants';
import { TableLogger, TableLoggerOptions } from './types';

export const createTableLogger = ({
  outDir,
  tableHeaders,
  columnWidths,
  columnPadding = DEFAULT_COLUMN_PADDING
}: TableLoggerOptions): TableLogger => {

  if (tableHeaders.length == 0) {
    throw new Error('No table headers were provided');
  }

  if (tableHeaders.length != columnWidths.length) {
    throw new Error('Length of table headers and columns widths do not match');
  }

  const columnCount: number = tableHeaders.length;
  const columnWidthsTotal = columnWidths.reduce((total, width) => total + width, 0);

  let logName = moment().format('DD.MM.YY hh-mm-ss A');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  let logFilePath = `${outDir}/${logName}`;

  const writeRow = (...columnValues: string[]) => {

    if (columnValues.length != columnCount) {
      throw new Error('Length of column values do not match');
    }

    let logRow = new Array(columnWidthsTotal).join(' ');
    let columnIndex = 0;
    for (let i = 0; i < columnCount; i++) {
      let columnValueTrimmed = columnValues[i].substring(0, columnWidths[i] - columnPadding);
      logRow = logRow.substr(0, columnIndex) + columnValueTrimmed + logRow.substr(columnIndex + columnValueTrimmed.length, columnWidthsTotal - columnValueTrimmed.length);
      columnIndex += columnWidths[i];
    }
    fs.appendFileSync(logFilePath, logRow.trim() + '\n');
  }

  writeRow(...tableHeaders);
  return { writeRow };
}

