import {User} from "@/types/User";
import {Project} from "@/types/Project";

export interface ProjectManager {
  id: number;
  user: User;
  active: boolean;
  status: string | null;
  projectJoinDate: string;
  projectLeaveDate: string | null;
}

export interface CreateProjectManagerModalProps {
  projectId: number;
  onCloseAction: () => void;
  onProjectUpdatedAction: (updatedProject: Project) => void;
}
