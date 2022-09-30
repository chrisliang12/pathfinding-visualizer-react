export function astar(grid, startNode, finishNode, whichHeuristic) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  let heuristic = manhattenDistance;
  if (whichHeuristic === "e") {
    heuristic = euclideanDistance;
  }
  let unvisitedNodes = []; 
  let visitedNodesInOrder = []; 
  startNode.distance = 0;
  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length !== 0) {
    unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
    let closestNode = unvisitedNodes.shift();
    if (closestNode === finishNode) {
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      return visitedNodesInOrder;
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    let neighbours = getNeighbours(closestNode, grid);
    for (let neighbour of neighbours) {
      let distance = closestNode.distance + 1;
      if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
        unvisitedNodes.unshift(neighbour);
        neighbour.distance = distance;

        // total distance = distance to come + heuristic
        neighbour.totalDistance =
          distance + heuristic(neighbour, finishNode);
        neighbour.previousNode = closestNode;
      } else if (distance < neighbour.distance) {
        neighbour.distance = distance;
        neighbour.totalDistance =
          distance + heuristic(neighbour, finishNode);
        neighbour.previousNode = closestNode;
      }
    }
  }
  return visitedNodesInOrder;
}

function getNeighbours(node, grid) {
  let neighbours = [];
  let { row, col } = node;
  if (col !== grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  if (row !== grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col !== 0) neighbours.push(grid[row][col - 1]);
  if (row !== 0) neighbours.push(grid[row - 1][col]);
  return neighbours.filter(
    (neighbour) => !neighbour.isWall && !neighbour.isVisited
  );
}

function neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes) {
  for (let node of unvisitedNodes) {
    if (node.row === neighbour.row && node.col === neighbour.col) {
      return false;
    }
  }
  return true;
}

function manhattenDistance(node, finishNode) {
  let x = Math.abs(node.row - finishNode.row);
  let y = Math.abs(node.col - finishNode.col);
  return x + y;
}

function euclideanDistance(node, finishNode) {
  let x = Math.abs(node.row - finishNode.row);
  let y = Math.abs(node.col - finishNode.col);
  return Math.sqrt(x * x + y * y);
}

export function getShortestPathAstar(finishNode) {
  let nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
