import React from "react"
import ReactDOM from "react-dom/client"
import "@xyflow/react/dist/style.css"

import Aplicacao from "@/App"
import "@/index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Aplicacao />
  </React.StrictMode>,
)
