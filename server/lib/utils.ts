import _ from "lodash";

import type { RowDataPacket } from "mysql2";
import type { Object } from "../routes/types.ts";
import { format } from "date-fns";

export function camelCaseObjectKeys(object: Object) {
  let key;
  const keys = Object.keys(object);
  const n = keys.length;
  const newObject: Object = {};

  for (let i = 0; i < n; i++) {
    key = keys[i];
    newObject[_.camelCase(key)] = object[key];
  }

  return newObject;
}

export function camelCaseRowFields<T extends RowDataPacket>(rows: T[]) {
  return rows.map((row) => camelCaseObjectKeys(row));
}

export function formatToMonth(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function titleCase(string: string) {
  return _.startCase(_.toLower(string));
}
