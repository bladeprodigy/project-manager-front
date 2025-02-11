import {User} from "@/types/User";
import {ProjectReport} from "@/types/ProjectReport";
import {ProjectManager} from "@/types/ProjectManager";
import {ProjectMember} from "@/types/ProjectMember";

export interface Project {
  id: number;
  name: string;
  clientName: string;
  status: string;
}

export interface CreateProjectPayload {
  name: string;
  clientName: string;
}

export interface CreateProjectModalProps {
  onCloseAction: () => void;
  onProjectCreatedAction: (project: Project) => void;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  clientName: string;
  creationDate: string;
  status: string;
  activeProjectManager?: ProjectManager;
  activeProjectMembers?: ProjectMember[];
  inactiveProjectManagers?: ProjectManager[];
  inactiveProjectMembers?: ProjectMember[];
  projectReports?: ProjectReport[];
}

export interface CreateReportModalProps {
  projectId: number;
  onCloseAction: () => void;
  onReportCreatedAction: (report: ProjectReport) => void;
}

export interface EditUserModalProps {
  user: User;
  onCloseAction: () => void;
  onUserUpdatedAction: (updatedUser: User) => void;
}

export interface DeleteProjectModalProps {
  projectId: number;
  onCloseAction: () => void;
}

export interface UpdateProjectModalProps {
  project: Project;
  onCloseAction: () => void;
  onProjectUpdatedAction: (updatedProject: Project) => void;
}

export interface ChangeStatusModalProps {
  projectId: number;
  currentStatus: string;
  onCloseAction: () => void;
  onStatusChangedAction: (updatedProject: Project) => void;
}
