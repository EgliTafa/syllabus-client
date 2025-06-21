import { TeachingPlan, EvaluationBreakdown, Topic } from '../../courses/core/_models';

export interface Course {
    id: number;
  title: string;
  code: string;
  year: number;
  semester: number;
  credits: number;
  lectureHours: number;
  seminarHours: number;
  labHours: number;
  practiceHours: number;
  courseTypeLabel?: string;
  examMethod?: string;
  academicProgram?: string;
  academicYear?: string;
  language?: string;
  ethicsCode?: string;
  teachingFormat?: string;
  teachingPlan?: TeachingPlan;
  evaluationBreakdown?: EvaluationBreakdown;
  objective?: string;
  keyConcepts?: string;
  prerequisites?: string;
  skillsAcquired?: string;
  courseResponsible?: string;
  topics?: Topic[];
  electiveGroup?: string | null; // 'Elective I', 'Elective II', or null
}

export interface Syllabus {
    id: number;
    name: string;
    academicYear: string;
    courses: Course[];
}
  
export interface CreateSyllabusRequest {
    name: string;
    academicYear: string;
    courses: CreateCourseRequest[];
}
  
export interface CreateCourseRequest {
  title: string;
  code: string;
  year: number;
  semester: number;
  credits: number;
  lectureHours: number;
  seminarHours: number;
  labHours: number;
  practiceHours: number;
  courseTypeLabel?: string;
  examMethod?: string;
  electiveGroup?: string | null; // 'Elective I', 'Elective II', or null
}
  
export interface UpdateSyllabusRequest {
    syllabusId: number;
    name: string;
    academicYear: string;
}
  
export interface AddOrRemoveCoursesFromSyllabusRequest {
    syllabusId: number;
    courseIdsToAdd: number[];
    courseIdsToRemove: number[];
}

export interface ListAllSyllabusesResponse {
  syllabuses: Syllabus[];
}
  