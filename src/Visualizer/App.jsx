import "./styles/App.css";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Node from "./Node";
import Interface from "./Interface";
import { bfs, getShortestPathBFS } from "../PathFindingAlgo/bfs";
import { dfs, getShortestPathDFS } from "../PathFindingAlgo/dfs";
import { dijkstra, getShortestPathDijkstra } from "../PathFindingAlgo/dijkstra";
import { astar, getShortestPathAstar } from "../PathFindingAlgo/astar";
import {
  bestfirst,
  getShortestPathBestFirst,
} from "../PathFindingAlgo/bestfirst";
import smMazePreset from "../mazePresets/smMaze";
import mdMazePreset from "../mazePresets/mdMaze";
import lgMazePreset from "../mazePresets/lgMaze";

let timeOutIdList = [];

function App() {
  /*
   * App States
   */
  const [state, setState] = useState({
    grid: [],
    gridWidth: 20 * 20 + 23,
    gridHeight: 20 * 15 + 23,
    startNode: [],
    endNode: [],
    mazeSize: "sm",
    currentAlgorithm: "bfs",
    isVisualizing: false,
    isGeneratingMaze: false,
    isClearing: false,
    animateSpeed: 10,
    mouseDown: false,
    nodeWidth: 20,
    heuristic: "manhatten",
  });

  //handle window resize
  useEffect(() => {
    function handleResize() {
      let nodeWidth;
      if (state.mazeSize === "sm") {
        nodeWidth = Math.min(window.innerWidth / 25, 20);
      }
      if (state.mazeSize === "md") {
        nodeWidth = Math.min(window.innerWidth / 50, 20);
      }
      if (state.mazeSize === "lg") {
        nodeWidth = Math.min(window.innerWidth / 80, 20);
      }
      setState((prev) => ({
        ...prev,
        nodeWidth: nodeWidth,
        gridWidth: nodeWidth * prev.grid[0].length + 23,
        gridHeight: nodeWidth * prev.grid.length + 23,
      }));
    }
    window.addEventListener("resize", handleResize);
    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  });

  // Initialize Grid
  useEffect(() => {
    let numRows = 15;
    let numCols = 20;
    let nodeWidth = 20;
    if (state.mazeSize === "sm") {
      numRows = 15;
      numCols = 20;
      nodeWidth = Math.min(window.innerWidth / 25, 20);
    }

    if (state.mazeSize === "md") {
      numRows = 30;
      numCols = 40;
      nodeWidth = Math.min(window.innerWidth / 50, 20);
    }

    if (state.mazeSize === "lg") {
      numRows = 40;
      numCols = 55;
      nodeWidth = Math.min(window.innerWidth / 80, 20);
    }

    const startRow = Math.floor(Math.random() * (numRows - 2));
    const startCol = Math.floor((Math.random() * numCols) / 4 + 1);
    const endRow = Math.floor(Math.random() * (numRows - 2));
    const endCol = Math.floor((Math.random() * numCols) / 2 + numCols / 2 - 1);
    const initialGrid = initializeGrid(
      numRows,
      numCols,
      startRow,
      startCol,
      endRow,
      endCol
    );

    function initializeGrid(
      numRows,
      numCols,
      startRow,
      startCol,
      endRow,
      endCol
    ) {
      let grid = [];
      for (let r = 0; r < numRows; r++) {
        let currRow = [];
        for (let c = 0; c < numCols; c++) {
          currRow.push(createNode(r, c, startRow, startCol, endRow, endCol));
        }
        grid.push(currRow);
      }
      return grid;
    }

    setState((prev) => ({
      ...prev,
      grid: initialGrid,
      startNode: [startRow, startCol],
      endNode: [endRow, endCol],
      gridHeight: nodeWidth * numRows + 23,
      gridWidth: nodeWidth * numCols + 23,
      nodeWidth: nodeWidth,
    }));
  }, [state.mazeSize]);

  function createNode(row, col, startRow, startCol, endRow, endCol) {
    return {
      row: row,
      col: col,
      distance: Infinity,
      totalDistance: Infinity,
      isPath: false,
      isVisited: false,
      isWall: false,
      isStart: row === startRow && col === startCol ? true : false,
      isEnd: row === endRow && col === endCol ? true : false,
      previousNode: null,
      width: 20,
      height: 20,
    };
  }

  // Handle Maze Control
  function handleMazeSm() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, mazeSize: "sm" }));
  }

  function handleMazeMd() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, mazeSize: "md" }));
  }

  function handleMazeLg() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, mazeSize: "lg" }));
  }

  /*
   * Mouse Event on Board
   */
  function handleNodeMouseDown(rowId, colId) {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prevState) => ({ ...prevState, mouseDown: true }));
    setState((prevState) => ({
      ...prevState,
      grid: prevState.grid.map((prevRow, prevRowId) => {
        return prevRowId === rowId
          ? prevRow.map((prevNode, prevNodeId) => {
              return prevNodeId === colId
                ? { ...prevNode, isWall: !prevNode.isWall }
                : prevNode;
            })
          : prevRow;
      }),
    }));
  }

  function handleNodeMouseEnter(rowId, colId) {
    if (!state.mouseDown) return;
    setState((prevState) => ({
      ...prevState,
      grid: prevState.grid.map((prevRow, prevRowId) => {
        return prevRowId === rowId
          ? prevRow.map((prevNode, prevNodeId) => {
              return prevNodeId === colId
                ? { ...prevNode, isWall: !prevNode.isWall }
                : prevNode;
            })
          : prevRow;
      }),
    }));
  }

  function handleNodeMouseUp() {
    setState((prev) => ({
      ...prev,
      mouseDown: false,
    }));
  }

  /*
   * Start and Clear Control
   */
  function handleClearPath() {
    let newGrid = state.grid.slice();
    for (let row of newGrid) {
      for (let node of row) {
        let newNode = {
          ...node,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          totalDistance: Infinity,
          previousNode: null,
        };
        newGrid[node.row][node.col] = newNode;
      }
    }
    setState((prev) => ({
      ...prev,
      grid: newGrid,
    }));
  }

  function handleClear() {
    if (state.isClearing) return;

    // clear exist timeout
    if (state.isVisualizing) {
      for (let id of timeOutIdList) {
        clearTimeout(id);
      }
    }

    // remove disabled className from classname list
    document.querySelectorAll(".btn").forEach((element) => {
      element.classList.remove("disabled");
    });

    // reset timeoutIdList
    timeOutIdList = [];

    let newGrid = state.grid.slice();
    for (let row of newGrid) {
      for (let node of row) {
        let newNode = {
          ...node,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          totalDistance: Infinity,
          previousNode: null,
        };
        newGrid[node.row][node.col] = newNode;
      }
    }
    setState((prev) => ({
      ...prev,
      grid: newGrid,
      isVisualizing: false,
    }));
  }

  function handleClearAll() {
    if (state.isClearing) {
      return;
    }

    // clear exist timeout
    if (state.isVisualizing) {
      for (let id of timeOutIdList) {
        clearTimeout(id);
      }
    }

    // remove disabled className from classname list
    document.querySelectorAll(".btn").forEach((element) => {
      element.classList.remove("disabled");
    });

    // reset timeoutIdList
    timeOutIdList = [];

    setState((prevState) => ({
      ...prevState,
      isVisualizing: false,
      grid: prevState.grid.map((prevRow) => {
        return prevRow.map((prevNode) => {
          return {
            ...prevNode,
            isVisited: false,
            isPath: false,
            isWall: false,
            distance: Infinity,
            totalDistance: Infinity,
            previousNode: null,
          };
        });
      }),
    }));
  }

  function handleStart() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    handleClearPath();
    // disable all control buttons during visualization
    document
      .querySelectorAll(".btn:not(#btn-clear, #btn-clear-dropdown)")
      .forEach((element) => {
        element.classList.add("disabled");
      });

    switch (state.currentAlgorithm) {
      case "dfs":
        visualizeDFS();
        break;
      case "dijkstra":
        visualizeDijkstra();
        break;
      case "bestfirst":
        visualizeBestFirst();
        break;
      case "astar":
        visualizeAstar();
        break;
      case "bfs":
      default:
        visualizeBFS();
        break;
    }
  }

  function animatePath(visitedNodesInOrder, nodesInShortestPath) {
    for (let i = 1; i < nodesInShortestPath.length; i++) {
      if (i === nodesInShortestPath.length - 1) {
        let tempId = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isVisualizing: false,
          }));
          document.querySelectorAll(".btn").forEach((element) => {
            element.classList.remove("disabled");
          });
        }, i * (1 * state.animateSpeed));
        timeOutIdList.push(tempId);
        return;
      }
      let node = nodesInShortestPath[i];
      let tempId = setTimeout(() => {
        setState((prevState) => {
          return {
            ...prevState,
            grid: prevState.grid.map((prevRow, prevRowId) => {
              return node.row === prevRowId
                ? prevRow.map((prevNode, prevNodeId) => {
                    return node.col === prevNodeId
                      ? { ...prevNode, isPath: true }
                      : prevNode;
                  })
                : prevRow;
            }),
          };
        });
      }, i * (1 * state.animateSpeed));
      timeOutIdList.push(tempId);
    }
  }

  function animateAlgorithm(visitedNodesInOrder, nodesInShortestPath) {
    let newGrid = state.grid.slice();
    for (let row of newGrid) {
      for (let node of row) {
        let newNode = {
          ...node,
          isVisited: false,
          isPath: false,
        };
        newGrid[node.row][node.col] = newNode;
      }
    }
    setState((prev) => ({
      ...prev,
      grid: newGrid,
    }));
    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      // animate visited nodes
      let tempId = setTimeout(() => {
        setState((prevState) => {
          return {
            ...prevState,
            grid: prevState.grid.map((prevRow, prevRowId) => {
              return node.row === prevRowId
                ? prevRow.map((prevNode, prevNodeId) => {
                    return node.col === prevNodeId
                      ? { ...prevNode, isVisited: true }
                      : prevNode;
                  })
                : prevRow;
            }),
          };
        });
      }, i * state.animateSpeed);
      timeOutIdList.push(tempId);

      if (i === visitedNodesInOrder.length - 1) {
        if (node.row === state.endNode[0] && node.col === state.endNode[1]) {
          let tempId = setTimeout(() => {
            animatePath(visitedNodesInOrder, nodesInShortestPath);
          }, i * state.animateSpeed);
          timeOutIdList.push(tempId);
        } else {
          let tempId = setTimeout(() => {
            setState((prev) => ({
              ...prev,
              isVisualizing: false,
            }));
            document.querySelectorAll(".btn").forEach((element) => {
              element.classList.remove("disabled");
            });
          }, i * state.animateSpeed);
          timeOutIdList.push(tempId);
        }
        return;
      }
    }
    setState((prev) => ({ ...prev, isVisualizing: false }));
  }

  function visualizeBFS() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, isVisualizing: true }));
    const { grid } = state;
    const startNode = grid[state.startNode[0]][state.startNode[1]];
    const endNode = grid[state.endNode[0]][state.endNode[1]];
    const visitedNodesInOrder = bfs(grid, startNode, endNode);
    const nodesInShortestPath = getShortestPathBFS(endNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPath);
  }

  function visualizeDFS() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, isVisualizing: true }));
    const { grid } = state;
    const startNode = grid[state.startNode[0]][state.startNode[1]];
    const endNode = grid[state.endNode[0]][state.endNode[1]];
    const visitedNodesInOrder = dfs(grid, startNode, endNode);
    const nodesInShortestPath = getShortestPathDFS(endNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPath);
  }

  function visualizeDijkstra() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, isVisualizing: true }));
    const { grid } = state;
    const startNode = grid[state.startNode[0]][state.startNode[1]];
    const endNode = grid[state.endNode[0]][state.endNode[1]];
    const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    const nodesInShortestPath = getShortestPathDijkstra(endNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPath);
  }

  function visualizeBestFirst() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, isVisualizing: true }));
    const { grid } = state;
    const startNode = grid[state.startNode[0]][state.startNode[1]];
    const endNode = grid[state.endNode[0]][state.endNode[1]];
    const visitedNodesInOrder = bestfirst(grid, startNode, endNode);
    const nodesInShortestPath = getShortestPathBestFirst(endNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPath);
  }

  function visualizeAstar() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, isVisualizing: true }));
    const { grid } = state;
    const startNode = grid[state.startNode[0]][state.startNode[1]];
    const endNode = grid[state.endNode[0]][state.endNode[1]];
    const visitedNodesInOrder = astar(
      grid,
      startNode,
      endNode,
      state.heuristic
    );
    const nodesInShortestPath = getShortestPathAstar(endNode);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPath);
  }

  /*
    Algorithm Control
  */
  function handleClickBFS() {
    setState((prev) => ({
      ...prev,
      currentAlgorithm: "bfs",
    }));
  }

  function handleClickDFS() {
    setState((prev) => ({
      ...prev,
      currentAlgorithm: "dfs",
    }));
  }

  function handleClickDijkstra() {
    setState((prev) => ({
      ...prev,
      currentAlgorithm: "dijkstra",
    }));
  }

  function handleClickAstar() {
    setState((prev) => ({
      ...prev,
      currentAlgorithm: "astar",
    }));
  }

  function handleClickBestFirst() {
    setState((prev) => ({
      ...prev,
      currentAlgorithm: "bestfirst",
    }));
  }

  /*
   * Speed Control
   */
  function handleSpeedSlow() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, animateSpeed: 200 }));
  }

  function handleSpeedMedium() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, animateSpeed: 100 }));
  }

  function handleSpeedFast() {
    if (state.isClearing || state.isGeneratingMaze || state.isVisualizing) {
      return;
    }
    setState((prev) => ({ ...prev, animateSpeed: 10 }));
  }

  function handleFixedPreset() {
    let mazeOption = smMazePreset;
    if (state.mazeSize === "sm") {
      mazeOption = smMazePreset;
    } else if (state.mazeSize === "md") {
      mazeOption = mdMazePreset;
    } else if (state.mazeSize === "lg") {
      mazeOption = lgMazePreset;
    }

    // generate maze
    let newGrid = state.grid;
    for (let i = 0; i < mazeOption.length; i++) {
      newGrid[mazeOption[i][0]][mazeOption[i][1]].isWall = true;
    }

    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[0].length; j++) {
        if (newGrid[i][j].isStart === true) {
          newGrid[i][j].isStart = false;
        }
        if (newGrid[i][j].isEnd === true) {
          newGrid[i][j].isEnd = false;
        }
      }
    }

    let startNode, endNode;
    if (state.mazeSize === "sm") {
      newGrid[13][1].isStart = true;
      newGrid[1][18].isEnd = true;
      startNode = [13, 1];
      endNode = [1, 18];
    } else if (state.mazeSize === "md") {
      newGrid[28][1].isStart = true;
      newGrid[1][38].isEnd = true;
      startNode = [28, 1];
      endNode = [1, 38];
    } else if (state.mazeSize === "lg") {
      newGrid[38][1].isStart = true;
      newGrid[1][53].isEnd = true;
      startNode = [38, 1];
      endNode = [1, 53];
    }

    setState((prev) => {
      return { ...prev, grid: newGrid, startNode: startNode, endNode: endNode };
    });
  }

  // function handleSaveMaze() {
  //   let output = [];
  //   for (let i = 0; i < state.grid.length; i++) {
  //     for (let j = 0; j < state.grid[0].length; j++) {
  //       if (state.grid[i][j].isWall)
  //         output.push([i, j]);
  //     }
  //   }
  //   const fileName = "my-file";
  //   const json = JSON.stringify(output);
  //   const blob = new Blob([json], { type: "application/json" });
  //   const href = URL.createObjectURL(blob);

  //   // create "a" HTML element with href to file
  //   const link = document.createElement("a");
  //   link.href = href;
  //   link.download = fileName + ".json";
  //   document.body.appendChild(link);
  //   link.click();

  //   // clean up "a" element & remove ObjectURL
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(href);
  // }

  return (
    <div className="App">
      <Header />
      <div
        className="container-fluid page"
        style={{
          marginTop: `${
            window.innerWidth < 800
              ? 0
              : state.mazeSize === "sm"
              ? 150
              : state.mazeSize === "md"
              ? 50
              : 0
          }px`,
        }}
      >
        <div className="board">
          <div
            className="card"
            style={{
              width: `${state.gridWidth}px`,
              height: `${state.gridHeight}px`,
            }}
          >
            <div className="board-container">
              {state.grid.map((row, rowId) => {
                return (
                  <div
                    key={rowId}
                    className="board-row"
                    style={{
                      height: `${state.nodeWidth}px`,
                      width: `${state.nodeWidth * row.length}px`,
                    }}
                  >
                    {row.map((node, nodeId) => {
                      return (
                        <Node
                          key={rowId + nodeId}
                          row={node.row}
                          col={node.col}
                          isVisited={node.isVisited}
                          isWall={node.isWall}
                          isStart={node.isStart}
                          isEnd={node.isEnd}
                          isPath={node.isPath}
                          width={state.nodeWidth}
                          height={state.nodeWidth}
                          handleNodeMouseDown={() =>
                            handleNodeMouseDown(node.row, node.col)
                          }
                          handleNodeMouseEnter={() =>
                            handleNodeMouseEnter(node.row, node.col)
                          }
                          handleNodeMouseUp={handleNodeMouseUp}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="interface">
          <Interface
            height={state.gridHeight}
            handleStart={handleStart}
            handleClear={handleClear}
            handleClearAll={handleClearAll}
            handleClickAstar={handleClickAstar}
            handleClickBestFirst={handleClickBestFirst}
            handleClickBFS={handleClickBFS}
            handleClickDFS={handleClickDFS}
            handleClickDijkstra={handleClickDijkstra}
            handleSpeedFast={handleSpeedFast}
            handleSpeedMedium={handleSpeedMedium}
            handleSpeedSlow={handleSpeedSlow}
            handleMazeLg={handleMazeLg}
            handleMazeMd={handleMazeMd}
            handleMazeSm={handleMazeSm}
            // handleSaveMaze={handleSaveMaze}
            handleFixedPreset={handleFixedPreset}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
