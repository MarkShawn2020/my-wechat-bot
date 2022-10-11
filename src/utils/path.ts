import path from "path";

export const GENERAL_DIR = __dirname
export const SRC_DIR = path.dirname(GENERAL_DIR)
export const PROJECT_DIR = path.dirname(SRC_DIR)

export const CACHE_DIR = path.join(PROJECT_DIR, 'cache')
export const LOGS_DIR = path.join(PROJECT_DIR, 'logs')
export const OUT_DIR = path.join(PROJECT_DIR, 'out')
export const CONFIG_DIR = path.join(PROJECT_DIR, 'config')
export const SYSTEM_CONFIG_DIR = path.join(CONFIG_DIR, 'system')
export const USER_CONFIG_DIR = path.join(CONFIG_DIR, 'user')
