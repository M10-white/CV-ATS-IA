export type AlertSeverity = "critical" | "warning" | "suggestion";
export type AlertCategory = "readability" | "structure" | "extraction" | "content";

export interface ATSAlert {
  severity: AlertSeverity;
  category: AlertCategory;
  message: string;
  recommendation: string;
  section?: string;
  field?: string;
}

export interface ATSScores {
  readability: number;
  structure: number;
  extraction: number;
  content: number;
  overall: number;
}

export interface ATSDiagnostic {
  scores: ATSScores;
  alerts: ATSAlert[];
  parserView: string;
}
