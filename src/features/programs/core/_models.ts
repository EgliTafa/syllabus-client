export interface Department {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Program {
  id: number;
  name: string;
  description: string;
  academicYear: string;
  departmentId: number;
  departmentName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProgramRequest {
  name: string;
  description: string;
  academicYear: string;
  departmentId: number;
}

export interface UpdateProgramRequest {
  id: number;
  name: string;
  description: string;
  academicYear: string;
  departmentId: number;
}

export interface ListAllProgramsResponse {
  programs: Program[];
}

export interface ListAllDepartmentsResponse {
  departments: Department[];
} 