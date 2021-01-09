
import { TaskLogger } from './../common/types';

export interface TableLoggerOptions {
  outDir: string;
  tableHeaders: string[];
  columnWidths: number[];
  columnPadding?: number;
}

export interface TableLogger extends TaskLogger {
  writeRow: (...columnValues: string[]) => void;
}

