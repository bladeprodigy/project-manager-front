import {Project} from "@/types/Project";

export interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  surname: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  surname: string;
  projects: Project[];
  projectsManaged: Project[];
}

export interface DeleteUserModalProps {
  userId: number;
  onCloseAction: () => void;
}
