import React from "react";
import "./styles/Node.css";

export default function Node(props) {
  const nodeState = props.isPath
    ? "path"
    : props.isStart
    ? "start"
    : props.isEnd
    ? "end"
    : props.isWall
    ? "wall"
    : props.isVisited
    ? "visited"
    : "unvisited";

  return (
    <div
      className={"node " + nodeState}
      style={{ width: `${props.width}px`, height: `${props.height}px` }}
      onMouseDown={props.handleNodeMouseDown}
      onMouseEnter={props.handleNodeMouseEnter}
      onMouseUp={props.handleNodeMouseUp}
      id={props.row + "-" + props.col}
    ></div>
  );
}
