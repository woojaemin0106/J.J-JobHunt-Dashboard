import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import mockApplications from "../data/mockApplications";
import { useAuth } from "./authStore";
import type { Application } from "../types/application";
import { generateId } from "../utils/id";
import { storage } from "../utils/storage";
import {
  buildScopeId,
  buildScopedStorageKey,
  migrateLegacyToScoped,
} from "../utils/scopedStorage";
import {
  applicationReducer,
  type ApplicationStoreState,
} from "./applicationStatePolicy";

type Status = Application["status"];

const STORAGE_RESOURCE = "applications";
const LEGACY_STORAGE_KEY = "jj_jobhunt_applications_v1";
const STORAGE_VERSION = 2;
const LEGACY_VERSION = 1;

type Actions = {
  addApplication: (input: Omit<Application, "id">) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  removeApplication: (id: string) => void;
  changeStatus: (id: string, status: Status) => void;
};

const StateCtx = createContext<ApplicationStoreState | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

function loadApplications(scopeId: string): Application[] {
  const scopedKey = buildScopedStorageKey(
    STORAGE_RESOURCE,
    STORAGE_VERSION,
    scopeId
  );
  const scopedData = storage.get<Application[]>(scopedKey);
  if (scopedData !== null) return scopedData;

  // Migrate once per user scope. Do not auto-migrate for guest scope.
  if (scopeId !== "guest") {
    const migrated = migrateLegacyToScoped<Application[]>({
      legacyKey: LEGACY_STORAGE_KEY,
      resource: STORAGE_RESOURCE,
      scopeId,
      fromVersion: LEGACY_VERSION,
      toVersion: STORAGE_VERSION,
    });

    if (migrated !== null) return migrated;
  }

  return mockApplications;
}

export function ApplicationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const scopeId = buildScopeId(user?.id);
  const storageKey = useMemo(
    () => buildScopedStorageKey(STORAGE_RESOURCE, STORAGE_VERSION, scopeId),
    [scopeId]
  );

  const [state, dispatch] = useReducer(
    applicationReducer,
    { applications: [] },
    () => ({ applications: loadApplications(scopeId) })
  );

  const previousScopeRef = useRef(scopeId);
  const skipPersistRef = useRef(false);

  useEffect(() => {
    if (previousScopeRef.current === scopeId) return;

    previousScopeRef.current = scopeId;
    skipPersistRef.current = true;
    dispatch({ type: "INIT", payload: loadApplications(scopeId) });
  }, [scopeId]);

  useEffect(() => {
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }

    storage.set(storageKey, state.applications);
  }, [state.applications, storageKey]);

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
