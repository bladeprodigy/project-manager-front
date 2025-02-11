import {User} from "@/types/User";
import {Project} from "@/types/Project";

export interface ProjectMember {
  id: number;
  user: User;
  projectRole: string | null;
  active: boolean;
  status: string | null;
  projectJoinDate: string;
  projectLeaveDate: string | null;
}

export interface CreateProjectMemberModalProps {
  projectId: number;
  onCloseAction: () => void;
  onProjectUpdatedAction: (updatedProject: Project) => void;
}

export interface ChangeWorkStatusModalProps {
  projectId: number;
  userId: number;
  isManager: boolean;
  onCloseAction: () => void;
  onStatusUpdatedAction: () => void;
}
