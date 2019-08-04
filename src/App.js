import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Text, Label, Tag, Image } from "react-konva";
import useImage from 'use-image';

const url = 'https://konvajs.github.io/assets/yoda.jpg';
function getRandomInt() {
  return parseInt(Math.random() * 1000, 10);
}
function SimpleApp(props) {  
  const [image] = useImage(props.url || url);

  // "image" will DOM image element or undefined
  const _id = getRandomInt;
  return (
    <Image id={props.id || _id} draggable image={image} />
  );
}

// textarea need be outside of Stage
class EditableText extends React.Component {
  state = {
    textEditVisible: false,
    textX: 0,
    textY: 0,
    textValue: 'Hello'
  };
  handleTextDblClick = e => {
    const absPos = e.target.getAbsolutePosition();
    this.setState({
      textEditVisible: true,
      textX: absPos.x,
      textY: absPos.y
    });
  };
  handleTextEdit = e => {
    this.setState({
      textValue: e.target.value
    });
  };
  handleTextareaKeyDown = e => {
    if (e.keyCode === 13) {
      this.setState({
        textEditVisible: false
      });
    }
  };
  render() {
    return (
      <div>
            <Text
              text={this.state.textValue}
              x={100}
              y={100}
              fontSize={20}
              onDblClick={this.handleTextDblClick}
            />
        <textarea
          value={this.state.textValue}
          style={{
            display: this.state.textEditVisible ? 'block' : 'none',
            position: 'absolute',
            top: this.state.textY + 'px',
            left: this.state.textX + 'px'
          }}
          onChange={this.handleTextEdit}
          onKeyDown={this.handleTextareaKeyDown}
        />
      </div>
    );
  }
}


class App extends Component {
  state = {
    images: [],
    textNodes: []
  }
  handleDragStart = e => {
    e.target.setAttrs({
      scaleX: 1.1,
      scaleY: 1.1
    });
  };
  handleDragEnd = e => {
    console.log(e.target.getAbsolutePosition(this.layerNode))
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1
    });
  };

  loadFromJson = () => {
    const obj = JSON.parse(localStorage.getItem('konva'));
    console.log(obj.images);
    this.setState({
      images: obj.images
    }); 
  }

  saveToJson = () => {
    // save stage as a json string
    const jsonString = this.stageNode.toJSON();
    const imageNodes = this.layerNode.find('Image');
    const jsonObject = JSON.parse(jsonString);
    jsonObject.images = [];
    imageNodes.forEach(element => {
      console.log(element.image().src);
      jsonObject.images.push({id: element.id(), url: element.image().src});
    });
    localStorage.setItem('konva', JSON.stringify(jsonObject));
  }
  addText = () => {
    this.setState({
      textNodes: [...this.state.textNodes, {id: getRandomInt()}] 
    })
  }
  render() {
    return (
      <div>
        <button onClick={this.addText}>Add text</button>
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
          {this.state.textNodes.map((text) => {
            return <Text key={text.id} draggable text='hello' />
          })}
          {this.state.images.map((image) => {
            return <SimpleApp key={image.id} id={image.id} url={image.url} />
          })}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default App;
