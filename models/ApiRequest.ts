import type Column from "./Column";

type ApiRequest = {
  columns: Column[];
  difficulty: number;
};

export default ApiRequest;
