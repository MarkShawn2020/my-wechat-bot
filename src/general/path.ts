import path from "path";

export const GENERAL_DIR = __dirname
export const SRC_DIR = path.dirname(GENERAL_DIR)
export const PROJECT_DIR = path.dirname(SRC_DIR)
export const CACHE_DIR = path.join(PROJECT_DIR, 'cache')