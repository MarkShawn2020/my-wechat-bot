import dotenv from "dotenv";

dotenv.config()

export const UBUNTU_PASTE_USERNAME = process.env.UBUNTU_PASTE_USERNAME
export const UBUNTU_PASTE_COOKIE = "sessionid=" + process.env.UBUNTU_PASTE_SESSIONID
export const UBUNTU_PASTE_HOST = 'https://paste.ubuntu.com'