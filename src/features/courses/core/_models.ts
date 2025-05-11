export interface TeachingPlan {
  lectureHours: number;
  labHours: number;
  practiceHours: number;
  exerciseHours: number;
  weeklyHours: number;
  individualStudyHours: number;
}

export interface EvaluationBreakdown {
  participationPercent: number;
  test1Percent: number;
  test2Percent: number;
  test3Percent: number;
  finalExamPercent: number;
}

export interface Topic {
  title: string;
  hours: number;
  reference?: string;
}

export interface CourseDetail {
  academicProgram: string;
  academicYear: string;
  language: string;
  courseTypeLabel: string;
  ethicsCode: string;
  examMethod: string;
  teachingFormat: string;
  credits: number;
  teachingPlan: TeachingPlan;
  evaluationBreakdown: EvaluationBreakdown;
  objective: string;
  keyConcepts: string;
  prerequisites: string;
  skillsAcquired: string;
  courseResponsible?: string;
  topics?: Topic[];
}

export interface Course {
  id: number;
  title: string;
  code: string;
  semester: number;
  lectureHours: number;
  seminarHours: number;
  labHours: number;
  credits: number;
  evaluation: EvaluationMethod;
  type: CourseType;
  detail?: CourseDetail;
}

export enum EvaluationMethod {
  Exam = 'Exam',
  Project = 'Project',
  Assignment = 'Assignment',
  Combined = 'Combined'
}

export enum CourseType {
  Mandatory = 'Mandatory',
  Elective = 'Elective',
  Optional = 'Optional'
}

export interface CreateCourseRequest {
  title: string;
  code: string;
  semester: number;
  lectureHours: number;
  seminarHours: number;
  labHours: number;
  credits: number;
  evaluation: EvaluationMethod;
  type: CourseType;
  syllabusId: number;
  detail?: CourseDetail;
}

export interface UpdateCourseRequest {
  courseId: number;
  title: string;
  code: string;
  semester: number;
  lectureHours: number;
  seminarHours: number;
  labHours: number;
  credits: number;
  evaluation: EvaluationMethod;
  type: CourseType;
}

export interface ListAllCoursesResponse {
  allCourses: Course[];
}

export interface GetCourseByIdRequest {
  courseId: number;
}

export interface DeleteCourseRequest {
  courseId: number;
} 