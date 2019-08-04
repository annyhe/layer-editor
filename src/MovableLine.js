import React from "react";
import { Line } from "react-konva";

class MovableLine extends React.Component {
  render() {
    return (
      <Line
        x={this.props.x}
        y={this.props.y}
        points={[this.props.x0, this.props.y0, this.props.x1, this.props.y1]}
        stroke="black"
        strokeWidth={5}
        draggable
        onDragEnd={this.props.handleLineDragEnd}
        ref="line"
      />
    );
  }
}

export default MovableLine;
