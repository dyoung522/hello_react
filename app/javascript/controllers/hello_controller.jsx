import * as React from "react";
import { Controller } from "@hotwired/stimulus";
import { createRoot } from "react-dom/client";
import Hello from "../components/Hello";

export default class extends Controller {
  connect() {
    createRoot(this.element).render(<Hello />);
  }
}
