// Pure helpers for the admin ResourceManager: DB row <-> form values <-> API payload.
// Kept free of React so it can be unit-tested.

export type FieldType = "text" | "textarea" | "number" | "boolean" | "list" | "json" | "select" | "date";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  /** Static choices for type "select". */
  options?: string[];
  /** Dynamic choices for type "select", loaded from another admin resource. */
  optionsFrom?: { resource: string; label: string[] };
  /** Initial value when creating. */
  default?: string | boolean;
}

export type FormValues = Record<string, string | boolean>;
export type Row = Record<string, unknown>;

export function emptyForm(fields: FieldDef[]): FormValues {
  const v: FormValues = {};
  for (const f of fields) v[f.key] = f.default ?? (f.type === "boolean" ? false : "");
  return v;
}

export function rowToForm(fields: FieldDef[], row: Row): FormValues {
  const v: FormValues = {};
  for (const f of fields) {
    const raw = row[f.key];
    switch (f.type) {
      case "boolean":
        v[f.key] = Boolean(raw);
        break;
      case "list":
        v[f.key] = Array.isArray(raw) ? raw.join("\n") : "";
        break;
      case "json":
        v[f.key] = JSON.stringify(raw ?? [], null, 2);
        break;
      case "date":
        v[f.key] = typeof raw === "string" ? raw.slice(0, 10) : "";
        break;
      default:
        v[f.key] = raw === null || raw === undefined ? "" : String(raw);
    }
  }
  return v;
}

export type PayloadResult = { ok: true; payload: Record<string, unknown> } | { ok: false; error: string };

export function formToPayload(fields: FieldDef[], values: FormValues): PayloadResult {
  const payload: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = values[f.key];
    switch (f.type) {
      case "boolean":
        payload[f.key] = Boolean(raw);
        break;
      case "number": {
        const s = String(raw ?? "").trim();
        if (s === "") {
          if (f.required) return { ok: false, error: `${f.label} is required` };
          break; // optional + empty → omit
        }
        const n = Number(s);
        if (!Number.isFinite(n)) return { ok: false, error: `${f.label} must be a number` };
        payload[f.key] = n;
        break;
      }
      case "list":
        payload[f.key] = String(raw ?? "")
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        break;
      case "json": {
        const s = String(raw ?? "").trim();
        try {
          payload[f.key] = s === "" ? [] : JSON.parse(s);
        } catch {
          return { ok: false, error: `${f.label} is not valid JSON` };
        }
        break;
      }
      default: {
        const s = String(raw ?? "").trim();
        if (f.required && s === "") return { ok: false, error: `${f.label} is required` };
        payload[f.key] = s;
      }
    }
  }
  return { ok: true, payload };
}

export type ColumnFormat = "bool" | "list" | "date" | "percent" | "money" | "option";

export interface ColumnDef {
  /** Supports dotted paths for embedded rows, e.g. "client.email". */
  key: string;
  label: string;
  format?: ColumnFormat;
  /** For format "money": key of the currency column. */
  currencyKey?: string;
}

export function getPath(row: Row, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Row)[k] : undefined), row);
}

export function formatCell(
  col: ColumnDef,
  row: Row,
  optionLabels: Record<string, Record<string, string>> = {}
): string {
  const v = getPath(row, col.key);
  if (v === null || v === undefined || v === "") return "—";
  switch (col.format) {
    case "bool":
      return v ? "Yes" : "No";
    case "list":
      return Array.isArray(v) ? v.join(", ") : String(v);
    case "date":
      return String(v).slice(0, 10);
    case "percent":
      return `${v}%`;
    case "money": {
      const cur = col.currencyKey ? String(getPath(row, col.currencyKey) ?? "") : "";
      return `${cur ? cur + " " : ""}${Number(v).toLocaleString("en-US")}`;
    }
    case "option":
      return optionLabels[col.key]?.[String(v)] ?? String(v);
    default:
      return String(v);
  }
}
