import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Text, Label, Tag } from "react-konva";

class App extends Component {
  state = {
      selectedText: 'first',
      changeTextTo: "Tooltip pointing down dasodnasdiandoandnasdonasdaidasiodasodhaodhaodhaoudhauo"
    };
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
  changeText = e => {
    this.setState({
      changeTextTo: e.target.value
    });
  }

  // const text = this.layerNode.find('Text')[0];
  
  render() {
    return (
      <div>
        <p>Selected text node ID: {this.state.selectedText}</p>
        <p>Change text to: <input defaultValue={this.state.changeTextTo} onChange={this.changeText} /></p>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer
            ref={node => {
              this.layerNode = node;
            }}
          >
            <Rect
              x={20}
              y={20}
              width={400}
              height={600}
              fill="white"
              stroke="black"
              strokeWidth={4}
            />
            <Label draggable x={24} y={20}>
              <Tag
                fill="white"
                stroke="black"
                strokeWidth={4}
                lineJoin="round"
              />
              {/* text is maximum 400 - 8*/}          
              <Text
              id='first'
                x={20}
                y={20}
                width={392}
                text={this.state.changeTextTo}
                wrap="word"
                fontFamily="Calibri"
                fontSize={18}
                padding={5}
                fill="black"
              />
            </Label>

            <Text
              id='second'
                x={120}
                y={120}
                width={200}
                text={this.state.changeTextTo}
                wrap="word"
                fontFamily="Calibri"
                fontSize={18}
                padding={5}
                fill="black"
              />     
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;
