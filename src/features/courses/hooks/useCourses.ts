import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import {
  setSelectedCourse,
  setCourseList,
  setIsFetching,
  setError,
} from "../state/courseSlice";
import {
  fetchAllCourses,
  fetchCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseDetails,
  updateCourseDetails,
} from "../core/_requests";
import { Course, CreateCourseRequest, UpdateCourseRequest, CourseDetail } from "../core/_models";

interface CourseState {
  selectedCourse: Course | null;
  courseList: Course[];
  isFetching: boolean;
  error: string | null;
}

export const useCourses = () => {
  const dispatch = useDispatch();
  const { selectedCourse, courseList, isFetching, error } = useSelector(
    (state: RootState) => state.course as CourseState
  );

  const loadCourses = useCallback(async () => {
    try {
      dispatch(setIsFetching(true));
      const courses = await fetchAllCourses();
      dispatch(setCourseList(courses));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "Failed to load courses"));
    } finally {
      dispatch(setIsFetching(false));
    }
  }, [dispatch]);

  const loadCourseById = useCallback(
    async (courseId: number) => {
      try {
        dispatch(setIsFetching(true));
        const course = await fetchCourseById(courseId);
        dispatch(setSelectedCourse(course));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to load course"));
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch]
  );

  const createNewCourse = useCallback(
    async (course: CreateCourseRequest) => {
      try {
        dispatch(setIsFetching(true));
        const newCourse = await createCourse(course);
        dispatch(setCourseList([...courseList, newCourse]));
        dispatch(setError(null));
        return newCourse;
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to create course"));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch, courseList]
  );

  const updateExistingCourse = useCallback(
    async (course: UpdateCourseRequest) => {
      try {
        dispatch(setIsFetching(true));
        const updatedCourse = await updateCourse(course);
        dispatch(
          setCourseList(
            courseList.map((c: Course) => (c.id === course.courseId ? updatedCourse : c))
          )
        );
        if (selectedCourse?.id === course.courseId) {
          dispatch(setSelectedCourse(updatedCourse));
        }
        dispatch(setError(null));
        return updatedCourse;
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to update course"));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch, courseList, selectedCourse]
  );

  const removeCourse = useCallback(
    async (courseId: number) => {
      try {
        dispatch(setIsFetching(true));
        await deleteCourse(courseId);
        dispatch(setCourseList(courseList.filter((c: Course) => c.id !== courseId)));
        if (selectedCourse?.id === courseId) {
          dispatch(setSelectedCourse(null));
        }
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to delete course"));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch, courseList, selectedCourse]
  );

  const addDetails = useCallback(
    async (courseId: number, details: CourseDetail) => {
      try {
        dispatch(setIsFetching(true));
        const updatedCourse = await addCourseDetails(courseId, details);
        dispatch(
          setCourseList(
            courseList.map((c: Course) => (c.id === courseId ? updatedCourse : c))
          )
        );
        if (selectedCourse?.id === courseId) {
          dispatch(setSelectedCourse(updatedCourse));
        }
        dispatch(setError(null));
        return updatedCourse;
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to add course details"));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch, courseList, selectedCourse]
  );

  const updateDetails = useCallback(
    async (courseId: number, details: CourseDetail) => {
      try {
        dispatch(setIsFetching(true));
        const updatedCourse = await updateCourseDetails(courseId, details);
        dispatch(
          setCourseList(
            courseList.map((c: Course) => (c.id === courseId ? updatedCourse : c))
          )
        );
        if (selectedCourse?.id === courseId) {
          dispatch(setSelectedCourse(updatedCourse));
        }
        dispatch(setError(null));
        return updatedCourse;
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to update course details"));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch, courseList, selectedCourse]
  );

  return {
    selectedCourse,
    courseList,
    isFetching,
    error,
    loadCourses,
    loadCourseById,
    createNewCourse,
    updateExistingCourse,
    removeCourse,
    addDetails,
    updateDetails,
  };
}; 