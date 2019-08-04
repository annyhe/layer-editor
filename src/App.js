import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Text, Label, Tag, Image } from "react-konva";
import useImage from 'use-image';

const url = 'https://konvajs.github.io/assets/yoda.jpg';

function SimpleApp() {  
  const [image] = useImage(url);

  // "image" will DOM image element or undefined
  const _id = parseInt(Math.random() * 1000, 10);
  return (
    <Image id={_id} draggable image={image} />
  );
}

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

  loadFromJson = () => {
    const json = localStorage.getItem('konva');
    console.log(json);
    // Konva.Node.create(json, 'container');
  }

  saveToJson = () => {
    // save stage as a json string
    const jsonString = this.stageNode.toJSON();
    const imageNodes = this.layerNode.find('Image');
    const jsonObject = JSON.parse(jsonString);
    jsonObject.images = {};
    imageNodes.forEach(element => {
      jsonObject.images[element.id()] = element.image().src;
    });
    localStorage.setItem('konva', JSON.stringify(jsonObject));
  }
  
  render() {
    return (
      <div>
        <button onClick={this.saveToJson}>Save to json</button>
        <button onClick={this.loadFromJson}>Load from json</button>
        <Stage 
            ref={node => {
              this.stageNode = node;
            }}        
          width={window.innerWidth} height={window.innerHeight}>
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
            <SimpleApp /> 
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
                text={'hello world'}
                wrap="word"
                fontFamily="Calibri"
                fontSize={18}
                padding={5}
                fill="black"
              />
            </Label> 
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;
