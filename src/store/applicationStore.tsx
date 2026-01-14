/**
 * 지원 정보(Application) 상태 관리 Store
 * Context API와 useReducer를 사용한 전역 상태 관리
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Application } from "../types/application";
import mockApplications from "../data/mockApplications";
import { storage } from "../utils/storage";
import { generateId } from "../utils/id";

type Status = Application["status"];

const STORAGE_KEY = "jj_jobhunt_applications_v1";

type State = { applications: Application[] };

type Action =
  | { type: "INIT"; payload: Application[] }
  | { type: "ADD"; payload: Application }
  | { type: "UPDATE"; payload: { id: string; patch: Partial<Application> } }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "CHANGE_STATUS"; payload: { id: string; status: Status } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { applications: action.payload };
    case "ADD":
      return { applications: [action.payload, ...state.applications] };
    case "UPDATE":
      return {
        applications: state.applications.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.patch } : a
        ),
      };
    case "REMOVE":
      return {
        applications: state.applications.filter(
          (a) => a.id !== action.payload.id
        ),
      };
    case "CHANGE_STATUS":
      return {
        applications: state.applications.map((a) =>
          a.id === action.payload.id
            ? { ...a, status: action.payload.status }
            : a
        ),
      };
    default:
      return state;
  }
}

type Actions = {
  addApplication: (input: Omit<Application, "id">) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  removeApplication: (id: string) => void;
  changeStatus: (id: string, status: Status) => void;
};

const StateCtx = createContext<State | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

export function ApplicationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, { applications: [] });

  useEffect(() => {
    const fromStorage = storage.get<Application[]>(STORAGE_KEY);
    dispatch({ type: "INIT", payload: fromStorage ?? mockApplications });
  }, []);

  useEffect(() => {
    storage.set(STORAGE_KEY, state.applications);
  }, [state.applications]);

  const actions = useMemo<Actions>(() => {
    return {
      addApplication(input) {
        dispatch({ type: "ADD", payload: { ...input, id: generateId() } });
      },
      updateApplication(id, patch) {
        dispatch({ type: "UPDATE", payload: { id, patch } });
      },
      removeApplication(id) {
        dispatch({ type: "REMOVE", payload: { id } });
      },
      changeStatus(id, status) {
        dispatch({ type: "CHANGE_STATUS", payload: { id, status } });
      },
    };
  }, []);

  return (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={actions}>{children}</ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(StateCtx);
  if (!ctx)
    throw new Error("useApplications must be used within ApplicationProvider");
  return ctx.applications;
}

export function useApplicationActions() {
  const ctx = useContext(ActionsCtx);
  if (!ctx)
    throw new Error(
      "useApplicationActions must be used within ApplicationProvider"
    );
  return ctx;
}
