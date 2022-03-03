// @flow
import React, { Component } from "react";
import { Terminal } from "xterm";
import styled from "styled-components";
import "xterm/dist/xterm.css";
import * as fit from "xterm/lib/addons/fit/fit";
import ResizeObserver from "resize-observer-polyfill";

const loremText = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

class TerminalOutput extends Component {
  xterm: Terminal;
  termWrapperRef: ?HTMLElement = null;
  resizeTimeout: TimeoutID;

  componentDidMount() {
    Terminal.applyAddon(fit);
    this.xterm = new Terminal({
      rendererType: "dom"
    });
    // The parent element for the terminal is attached and removed manually so
    // that we can preserve it across mounts and unmounts of the component
    //this.termRef = this.props.term ? this.props.term._core._parent : document.createElement('div');
    //this.termRef.className = 'term_fit term_term';

    this.xterm.open(this.termWrapperRef);
    this.write(">>> Hello from \x1B[1;3;31mxterm.js\x1B[0m\r\n");
    this.write(loremText);
    this.xterm.fit();

    // fake terminal code --> commented because not needed for resize-demo
    /*this.xterm.prompt = () => {
      this.xterm.write('\r\n>>> ');
    };

    this.xterm._core.register(
      this.xterm.addDisposableListener('key', (key, ev) => {
        const printable =
          !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) {
          this.xterm.prompt();
        } else if (ev.keyCode === 8) {
          // Do not delete the prompt
          if (this.xterm._core.buffer.x > 2) {
            this.xterm.write('\b \b');
          }
        } else if (printable) {
          this.xterm.write(key);
        }
      })
    );

    this.xterm._core.register(
      this.xterm.addDisposableListener('paste', (data, ev) => {
        this.xterm.write(data);
      })
    );*/
  }

  componentWillUnmount() {
    if (this.xterm) {
      this.xterm.destroy();
      this.xterm = null;
    }
  }

  fitResize() {
    if (!this.termWrapperRef) {
      return;
    }
    this.xterm.fit();
  }

  onTermWrapperRef = (component) => {
    this.termWrapperRef = component;

    if (component) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.resizeTimeout) {
          return;
        }
        this.resizeTimeout = setTimeout(() => {
          delete this.resizeTimeout;
          this.fitResize();
        }, 0);
      });
      this.resizeObserver.observe(component);
    } else {
      this.resizeObserver.disconnect();
    }
  };

  write(data: any) {
    this.xterm && this.xterm.write(data);
  }

  handleResize = (evt) => {
    if (!this.xterm) return;

    if (this.resizeTimeout) {
      return;
    }

    this.resizeTimeout = setTimeout(() => {
      delete this.resizeTimeout;
      this.xterm.fit();
    }, 0);
  };

  render() {
    return <XtermContainer ref={this.onTermWrapperRef} />;
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const XtermContainer = styled.div`
  width: 100%;
  height: 100%;

  .xterm .xterm-viewport {
    border-radius: 4px;
    overflow-y: hidden;
  }
`;

export default TerminalOutput;
