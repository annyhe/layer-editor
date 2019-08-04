import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Text, Label, Tag, Image } from "react-konva";
import useImage from 'use-image';

const url = 'https://konvajs.github.io/assets/yoda.jpg';

function SimpleApp(props) {  
  const [image] = useImage(props.url || url);

  // "image" will DOM image element or undefined
  const _id = parseInt(Math.random() * 1000, 10);
  return (
    <Image id={props.id || _id} draggable image={image} />
  );
}

class App extends Component {
  state = {
    images: []
  }
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
    const obj = JSON.parse(localStorage.getItem('konva'));
    console.log(obj.images);
    this.setState({
      images: obj.images
    })
    // obj.children[0].children.forEach((child) => {
    //   console.log(child.className); 
    //   if (child.className === 'Image') { 
    //     console.log(child.attrs.id); 
    //     console.log(obj.images[child.attrs.id]);
    //   } 
    // });
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
