export interface ProjectReport {
  id: number;
  reportDate: string;
  title: string;
  content: string;
}

export interface ReportModalProps {
  report: ProjectReport;
  onCloseAction: () => void;
}
