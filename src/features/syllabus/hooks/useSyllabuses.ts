import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import {
  setSelectedSyllabus,
  setSyllabusList,
  setPaginatedSyllabusList,
  setIsFetching,
  setError,
} from "../state/syllabusSlice";
import {
  fetchAllSyllabuses,
  fetchSyllabusById,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
  addOrRemoveCoursesFromSyllabus,
} from "../core/_requests";
import { Syllabus, CreateSyllabusRequest, UpdateSyllabusRequest, AddOrRemoveCoursesFromSyllabusRequest, SyllabusListParams } from "../core/_models";

interface SyllabusState {
  selectedSyllabus: Syllabus | null;
  syllabusList: Syllabus[];
  isFetching: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const useSyllabuses = () => {
  const dispatch = useDispatch();
  const { 
    selectedSyllabus, 
    syllabusList, 
    isFetching, 
    error,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage
  } = useSelector(
    (state: RootState) => state.syllabus as SyllabusState
  );

  const loadSyllabuses = useCallback(async (params?: SyllabusListParams) => {
    try {
      dispatch(setIsFetching(true));
      const response = await fetchAllSyllabuses(params);
      dispatch(setPaginatedSyllabusList(response));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "Failed to load syllabuses"));
    } finally {
      dispatch(setIsFetching(false));
    }
  }, [dispatch]);

  const loadSyllabusById = useCallback(
    async (syllabusId: number) => {
      try {
        dispatch(setIsFetching(true));
        const syllabus = await fetchSyllabusById(syllabusId);
        dispatch(setSelectedSyllabus(syllabus));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to load syllabus"));
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch]
  );

  const createNewSyllabus = useCallback(
    async (syllabus: CreateSyllabusRequest) => {
      try {
        dispatch(setIsFetching(true));
        const newSyllabus = await createSyllabus(syllabus);
        dispatch(setSyllabusList([...syllabusList, newSyllabus]));
        dispatch(setError(null));
        return newSyllabus;
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to create syllabus"));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch, syllabusList]
  );

  const updateExistingSyllabus = useCallback(
    async (syllabusId: number, syllabus: UpdateSyllabusRequest) => {
      try {
        dispatch(setIsFetching(true));
        const updatedSyllabus = await updateSyllabus(syllabus);
        dispatch(setSyllabusList(syllabusList.map(s => s.id === syllabusId ? updatedSyllabus : s)));
        dispatch(setError(null));
        return updatedSyllabus;
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to update syllabus"));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch, syllabusList]
  );

  const deleteExistingSyllabus = useCallback(
    async (syllabusId: number) => {
      try {
        dispatch(setIsFetching(true));
        await deleteSyllabus(syllabusId);
        dispatch(setSyllabusList(syllabusList.filter(s => s.id !== syllabusId)));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to delete syllabus"));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch, syllabusList]
  );

  const addOrRemoveCourses = useCallback(
    async (syllabusId: number, request: AddOrRemoveCoursesFromSyllabusRequest) => {
      try {
        dispatch(setIsFetching(true));
        const updatedSyllabus = await addOrRemoveCoursesFromSyllabus(request);
        dispatch(setSyllabusList(syllabusList.map(s => s.id === syllabusId ? updatedSyllabus : s)));
        dispatch(setError(null));
        return updatedSyllabus;
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to update syllabus courses"));
        throw err;
      } finally {
        dispatch(setIsFetching(false));
      }
    },
    [dispatch, syllabusList]
  );

  return {
    selectedSyllabus,
    syllabusList,
    isFetching,
    error,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    loadSyllabuses,
    loadSyllabusById,
    createNewSyllabus,
    updateExistingSyllabus,
    deleteExistingSyllabus,
    addOrRemoveCourses,
  };
};

// Legacy hook for backward compatibility
export const useGetAllSyllabuses = () => {
  const dispatch = useDispatch();
  const { syllabusList, isFetching } = useSelector(
    (state: RootState) => state.syllabus as SyllabusState
  );

  const fetchAndUpdateSyllabuses = useCallback(async (dispatch: any) => {
    try {
      dispatch(setIsFetching(true));
      const response = await fetchAllSyllabuses();
      dispatch(setPaginatedSyllabusList(response));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "Failed to load syllabuses"));
    } finally {
      dispatch(setIsFetching(false));
    }
  }, []);

  return {
    syllabusList,
    isFetching,
    fetchAndUpdateSyllabuses,
  };
};

// Hook for getting a single syllabus by ID
export const useGetSyllabusById = (syllabusId?: number) => {
  const dispatch = useDispatch();
  const { selectedSyllabus, isFetching } = useSelector(
    (state: RootState) => state.syllabus as SyllabusState
  );

  const fetchAndUpdateSyllabusById = useCallback(async (id: number) => {
    try {
      dispatch(setIsFetching(true));
      const syllabus = await fetchSyllabusById(id);
      dispatch(setSelectedSyllabus(syllabus));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "Failed to load syllabus"));
    } finally {
      dispatch(setIsFetching(false));
    }
  }, [dispatch]);

  return { 
    selectedSyllabus, 
    isFetching, 
    fetchAndUpdateSyllabusById 
  };
};
