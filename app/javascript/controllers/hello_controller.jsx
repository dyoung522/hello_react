import * as React from "react";
import { Controller } from "@hotwired/stimulus";
import { createRoot } from "react-dom/client";
import Hello from "../components/Hello";

export default class extends Controller {
  static values = { greet: String };

  connect() {
    createRoot(this.element).render(<Hello greet={this.greetValue} />);
  }
}
