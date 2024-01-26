
import { app } from "../main"
import { Handler } from "./index.g"

export const onRequest = Handler(app, () => 'Hi!')