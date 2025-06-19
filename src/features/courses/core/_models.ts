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
  literature?: string; // Backend support coming soon
}

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
  evaluation?: EvaluationMethod;
  type?: CourseType;
  electiveGroup?: string | null;
  // Flat API fields (optional)
  courseTypeLabel?: string;
  examMethod?: string;
  teachingPlan?: TeachingPlan;
  ethicsCode?: string;
  teachingFormat?: string;
  language?: string;
  academicProgram?: string;
  academicYear?: string;
  courseResponsible?: string;
  objective?: string;
  keyConcepts?: string;
  prerequisites?: string;
  skillsAcquired?: string;
  evaluationBreakdown?: EvaluationBreakdown;
  topics?: Topic[];
  // Nested detail (for compatibility)
  detail?: CourseDetail;
}

export enum EvaluationMethod {
  Exam = 'Exam',
  ContinuousAssessment = 'ContinuousAssessment',
  Pass = 'Pass',
  DiplomaExam = 'DiplomaExam'
}

export enum CourseType {
  Mandatory = 'Mandatory',
  Advanced = 'Advanced',
  Specialized = 'Specialized',
  Elective = 'Elective',
  FinalProject = 'FinalProject'
}

export interface CreateCourseRequest {
  title: string;
  code: string;
  semester: number;
  lectureHours: number;
  seminarHours: number;
  labHours: number;
  practiceHours: number;
  credits: number;
  evaluation: EvaluationMethod;
  type: CourseType;
  syllabusId: number;
  year: number;
  electiveGroup?: string;
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