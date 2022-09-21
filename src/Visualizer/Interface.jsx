import React from "react";
import "./styles/Interface.css";

export default function Interface(props) {
  return (
    <div
      className="card interface-card"
      // style={{ width: `${props.width}px`, height: `${props.height}px` }}
    >
      <ul className="list-group listgroup-flush">
        <li className="list-group-item">
          <p>Algorithms</p>
          <div
            className="btn-group control-btn"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              autoComplete="off"
              defaultChecked
            ></input>
            <label
              onClick={props.handleClickBFS}
              className="btn btn-outline-dark"
              htmlFor="btnradio1"
            >
              BFS
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio2"
              autoComplete="off"
            ></input>
            <label
              onClick={props.handleClickDFS}
              className="btn btn-outline-dark"
              htmlFor="btnradio2"
            >
              DFS
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio3"
              autoComplete="off"
            ></input>
            <label
              onClick={props.handleClickDijkstra}
              className="btn btn-outline-dark"
              htmlFor="btnradio3"
            >
              Dijkstra
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio4"
              autoComplete="off"
            ></input>
            <label
              onClick={props.handleClickBestFirst}
              className="btn btn-outline-dark"
              htmlFor="btnradio4"
            >
              Best First
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio5"
              autoComplete="off"
            ></input>
            <label
              onClick={props.handleClickAstar}
              className="btn btn-outline-dark"
              htmlFor="btnradio5"
            >
              A*
            </label>
          </div>
        </li>

        <li className="list-group-item">
          <p>Maze</p>
          <div
            className="btn-group  control-btn"
            role="group"
            aria-label="maze"
          >
            <input
              type="radio"
              className="btn-check"
              name="maze"
              id="maze1"
              autoComplete="off"
              defaultChecked
            ></input>
            <label onClick={props.handleMazeSm} className="btn btn-outline-dark" htmlFor="maze1">
              Small
            </label>

            <input
              type="radio"
              className="btn-check"
              name="maze"
              id="maze2"
              autoComplete="off"
            ></input>
            <label onClick={props.handleMazeMd} className="btn btn-outline-dark" htmlFor="maze2">
              Medium
            </label>

            <input
              type="radio"
              className="btn-check"
              name="maze"
              id="maze3"
              autoComplete="off"
            ></input>
            <label onClick={props.handleMazeLg} className="btn btn-outline-dark" htmlFor="maze3">
              Large
            </label>

            <input
              type="radio"
              className="btn-check"
              name="maze"
              id="maze4"
              autoComplete="off"
            ></input>
            <label className="btn btn-outline-dark disabled" htmlFor="maze4">
              Preset
            </label>
          </div>
        </li>

        <li className="list-group-item">
          <p>Speed</p>
          <div
            className="btn-group  control-btn"
            role="group"
            aria-label="speed"
          >
            <input
              type="radio"
              className="btn-check"
              name="speed"
              id="speed1"
              autoComplete="off"
            ></input>
            <label
              onClick={props.handleSpeedSlow}
              className="btn btn-outline-dark"
              htmlFor="speed1"
            >
              Slow
            </label>

            <input
              type="radio"
              className="btn-check"
              name="speed"
              id="speed2"
              autoComplete="off"
            ></input>
            <label
              onClick={props.handleSpeedMedium}
              className="btn btn-outline-dark"
              htmlFor="speed2"
            >
              Medium
            </label>

            <input
              type="radio"
              className="btn-check"
              name="speed"
              id="speed3"
              autoComplete="off"
              defaultChecked
            ></input>
            <label
              onClick={props.handleSpeedFast}
              className="btn btn-outline-dark"
              htmlFor="speed3"
            >
              Fast
            </label>
          </div>
        </li>

        <li className="list-group-item start-row">
          <div className="row">
            <div className="col-6 btn-col-start">
              <div className="d-grid gap-2">
                <button
                  onClick={props.handleStart}
                  type="button"
                  className="btn btn-success"
                >
                  Start
                </button>
              </div>
            </div>
            <div className="col-6 btn-col-clear">
              <div className="d-grid gap-2">
                <div className="btn-group">
                  <button onClick={props.handleClear} type="button" className="btn btn-danger w-100">
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="visually-hidden">Toggle Dropdown</span>
                  </button>
                  <ul className="dropdown-menu">
                  <li><a onClick={props.handleClearAll} className="dropdown-item" href="#">Clear All</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
