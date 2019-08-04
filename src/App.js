import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Star, Rect, Text, Label, Tag } from "react-konva";

class App extends Component {
  handleDragStart = e => {
    e.target.setAttrs({
      scaleX: 1.1,
      scaleY: 1.1
    });
  };
  handleDragEnd = e => {
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1
    });
  };
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect
            x={20}
            y={20}
            width={400}
            height={600}
            fill="white"
            stroke="black"
            strokeWidth={4}
          />
          <Label draggable x={150} y={50}>
            <Tag
              fill="white"
              stroke="black"
              strokeWidth={4} 
              lineJoin="round"
            />
            <Text
              text="Tooltip pointing down"
              fontFamily="Calibri"
              fontSize={18}
              padding={5}
              fill="black"
            />
          </Label>
        </Layer>
      </Stage>
    );
  }
}

export default App;
