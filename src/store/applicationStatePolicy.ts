import type { Application } from "../types/application";

type Status = Application["status"];

export type ApplicationStoreState = { applications: Application[] };

export type ApplicationStoreAction =
  | { type: "INIT"; payload: Application[] }
  | { type: "ADD"; payload: Application }
  | { type: "UPDATE"; payload: { id: string; patch: Partial<Application> } }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "CHANGE_STATUS"; payload: { id: string; status: Status } };

export function applicationReducer(
  state: ApplicationStoreState,
  action: ApplicationStoreAction
): ApplicationStoreState {
  switch (action.type) {
    case "INIT":
      return { applications: action.payload };
    case "ADD":
      return { applications: [action.payload, ...state.applications] };
    case "UPDATE":
      return {
        applications: state.applications.map((application) =>
          application.id === action.payload.id
            ? { ...application, ...action.payload.patch }
            : application
        ),
      };
    case "REMOVE":
      return {
        applications: state.applications.filter(
          (application) => application.id !== action.payload.id
        ),
      };
    case "CHANGE_STATUS":
      return {
        applications: state.applications.map((application) =>
          application.id === action.payload.id
            ? { ...application, status: action.payload.status }
            : application
        ),
      };
    default:
      return state;
  }
}
