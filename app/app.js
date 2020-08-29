import * as React from "react";
import { unstable_createRoot } from "react-dom";
import KittenPush from "./components/KittenPush";

navigator.serviceWorker.register("service-worker.js").then(reg => reg.update());

class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { error: null, stack: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, stack: errorInfo.componentStack });
  }

  render() {
    if (this.state.error !== null) {
      return (
        <React.Fragment>
          <h1>Oops, something went wrong! :(</h1>
          <p>
            <b>
              Please give the following information to a hard working tech kitten.
            </b>
          </p>
          <p>
            <u>Error: </u>
            {this.state.error.toString()}
          </p>
          <p>
            <u>Stack: </u>
            {this.state.stack}
          </p>
        </React.Fragment>
      );
    }
    return this.props.children;
  }
}

unstable_createRoot(document.getElementById("main")).render(<ErrorBoundary><KittenPush/></ErrorBoundary>);
