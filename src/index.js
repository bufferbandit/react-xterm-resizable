import React from "react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import TerminalOutput from "./TerminalOutput";
import { ResizableBox } from "react-resizable";
import styled from "styled-components";

import "react-resizable/css/styles.css";

function App() {
  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight
  });

  const updateSize = () =>
    setSize({
      x: window.innerWidth,
      y: window.innerHeight
    });

  useEffect(() => (window.onresize = updateSize), []);

  const Wrapper = styled.div`
    width: 100%;
    height: 100%;
  `;

  console.log(size.x, size.y);

  return (
    <div className="App">
      <ResizableBox
        className="box"
        height={size.y}
        width={size.x}
        onResize={(evt, { size }) => updateSize(size)}
      >
        <Wrapper>
          <TerminalOutput />
        </Wrapper>
      </ResizableBox>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
