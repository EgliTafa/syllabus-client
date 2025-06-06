import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSyllabuses, fetchSyllabusById } from "../core/_requests";
import { Syllabus } from "../core/_models";
import {
  setSyllabusList,
  setSelectedSyllabus,
  setIsFetching,
  setError,
} from "../state/syllabusSlice";
import { Dispatch } from "redux";
import { AnyAction } from "@reduxjs/toolkit";
import { IStateStore, store } from "../../../app/store";

var isLoading = false;

const fetchAndUpdateSyllabuses = async (dispatch: Dispatch<AnyAction>) => {
  isLoading = store.getState().syllabus.isFetching;
  if (isLoading) return;

  dispatch(setIsFetching(true));
  try {
    const data = await fetchAllSyllabuses();
    dispatch(setSyllabusList(data));
  } catch (e: any) {
    dispatch(setError(e?.message));
  }
  dispatch(setIsFetching(false));
};

const fetchAndUpdateSyllabusById = async (
  syllabusId: number,
  dispatch: Dispatch<AnyAction>
) => {
  isLoading = store.getState().syllabus.isFetching;
  if (!syllabusId || isLoading) return;

  dispatch(setIsFetching(true));
  try {
    const data = await fetchSyllabusById(syllabusId);
    dispatch(setSelectedSyllabus(data));
  } catch (e: any) {
    dispatch(setError(e?.message));
  }
  dispatch(setIsFetching(false));
};

export const useGetAllSyllabuses = () => {
  const dispatch = useDispatch();
  const syllabusList = useSelector(
    (state: IStateStore) => state.syllabus.syllabusList
  );
  const isFetching = useSelector(
    (state: IStateStore) => state.syllabus.isFetching
  );

  useEffect(() => {
    fetchAndUpdateSyllabuses(dispatch);
  }, []);

  return { syllabusList, isFetching, fetchAndUpdateSyllabuses };
};

export const useGetSyllabusById = (syllabusId?: number) => {
  const dispatch = useDispatch();
  const selectedSyllabus = useSelector(
    (state: IStateStore) => state.syllabus.selectedSyllabus
  );
  const isFetching = useSelector(
    (state: IStateStore) => state.syllabus.isFetching
  );

  useEffect(() => {
    if (syllabusId) {
      fetchAndUpdateSyllabusById(syllabusId, dispatch);
    }
  }, [syllabusId]);

  return { selectedSyllabus, isFetching, fetchAndUpdateSyllabusById };
};

export const useSyllabusesByAcademicYear = () => {
  const dispatch = useDispatch();
  const { syllabusList, isFetching, fetchAndUpdateSyllabuses } = useGetAllSyllabuses();

  useEffect(() => {
    fetchAndUpdateSyllabuses(dispatch);
  }, [dispatch, fetchAndUpdateSyllabuses]);

  const syllabusesByYear = useMemo(() => {
    if (!syllabusList) return new Map<string, Syllabus[]>();

    return syllabusList.reduce((acc, syllabus) => {
      const year = syllabus.academicYear;
      if (!acc.has(year)) {
        acc.set(year, []);
      }
      acc.get(year)?.push(syllabus);
      return acc;
    }, new Map<string, Syllabus[]>());
  }, [syllabusList]);

  const sortedYears = useMemo(() => {
    return Array.from(syllabusesByYear.keys()).sort((a, b) => {
      const [aStart] = a.split('-').map(Number);
      const [bStart] = b.split('-').map(Number);
      return bStart - aStart; // Sort in descending order (newest first)
    });
  }, [syllabusesByYear]);

  return {
    syllabusesByYear,
    sortedYears,
    isFetching
  };
};
