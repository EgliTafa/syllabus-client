export interface Topic {
  title: string;
  hours: number;
  reference?: string;
}

export interface Course {
    id: number;
  title: string;
  code: string;
  semester: number;
  credits: number;
  academicProgram?: string;
  academicYear?: string;
  language?: string;
  courseTypeLabel?: string;
  ethicsCode?: string;
  examMethod?: string;
  teachingFormat?: string;
  teachingPlan?: any; // TODO: Define proper type
  evaluationBreakdown?: any; // TODO: Define proper type
  objective?: string;
  keyConcepts?: string;
  prerequisites?: string;
  skillsAcquired?: string;
  courseResponsible?: string;
  topics?: Topic[];
}

export interface Syllabus {
    id: number;
    name: string;
  courses: Course[];
  }
  
export interface CreateSyllabusRequest {
    name: string;
  courses: CreateCourseRequest[];
  }
  
export interface CreateCourseRequest {
  title: string;
  code: string;
  semester: number;
  credits: number;
  // Add other fields as needed
  }
  
export interface UpdateSyllabusRequest {
    syllabusId: number;
    name: string;
  }
  
export interface AddOrRemoveCoursesFromSyllabusRequest {
    syllabusId: number;
    courseIdsToAdd: number[];
    courseIdsToRemove: number[];
  }

export interface ListAllSyllabusesResponse {
  syllabuses: Syllabus[];
}
  