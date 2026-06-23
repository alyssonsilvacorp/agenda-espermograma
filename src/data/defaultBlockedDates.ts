import type { BlockedDate } from "../types/appointment";

// Edite esta lista para incluir novos feriados padrão da unidade.
export const DEFAULT_BLOCKED_DATES: BlockedDate[] = [
  {
    id: "default-2026-06-24",
    date: "2026-06-24",
    type: "Feriado municipal",
    reason: "Feriado de São João / unidade fechada",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "default-2026-09-07",
    date: "2026-09-07",
    type: "Feriado nacional",
    reason: "Independência do Brasil",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "default-2026-10-12",
    date: "2026-10-12",
    type: "Feriado nacional",
    reason: "Nossa Senhora Aparecida",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "default-2026-11-02",
    date: "2026-11-02",
    type: "Feriado nacional",
    reason: "Finados",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "default-2026-11-15",
    date: "2026-11-15",
    type: "Feriado nacional",
    reason: "Proclamação da República",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "default-2026-11-20",
    date: "2026-11-20",
    type: "Feriado nacional",
    reason: "Dia Nacional de Zumbi e da Consciência Negra",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "default-2026-12-25",
    date: "2026-12-25",
    type: "Feriado nacional",
    reason: "Natal",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];
