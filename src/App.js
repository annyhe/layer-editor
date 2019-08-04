import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import useImage from "use-image";

const url = "https://konvajs.github.io/assets/yoda.jpg";
function getRandomInt() {
  return parseInt(Math.random() * 1000, 10);
}
function SimpleApp(props) {
  const [image] = useImage(props.url || url);

  // "image" will DOM image element or undefined
  const _id = getRandomInt;
  return <Image id={props.id || _id} draggable image={image} />;
}

class EditableText extends React.Component {
  handleTextDblClick = e => {
    this.props.updateTextState(e);
  };

  render() {
    return (
    <Text
    draggable
        id={this.props.id}
        text={this.props.textValue}
        x={this.props.textX}
        y={this.props.textY}
        fontSize={20}
        onDblClick={this.handleTextDblClick}
      />
    );
  }
}

class App extends Component {
  state = {
    images: [],
    textNodes: [],
    textEditVisible: false,
    // for temporary edits
    textX: 0,
    textY: 0,
    textValue: 'hello world',
    currentTextNodeID: 0,
  };
  updateTextState = e => {
    const absPos = e.target.getAbsolutePosition();
    console.log(this.state.textNodes)
    const nodeID = e.target.id();

    const copyOfNodes = [...this.state.textNodes];
    const node = copyOfNodes.filter((node) => node.id === nodeID);
    node.textX = absPos.x;
    node.textY = absPos.y;
    
    this.setState({
      textValue: e.target.text(),
      textEditVisible: true,
      textNodes: copyOfNodes,
      textX: absPos.x,
      textY: absPos.y,
      currentTextNodeID: nodeID
    });
  }
  handleTextAreaEdit = e => {
    this.setState({
      textValue: e.target.value
    });
  };
  handleTextareaKeyDown = e => {
    const copyOfNodes = [...this.state.textNodes];
    const nodes = copyOfNodes.filter((node) => node.id === this.state.currentTextNodeID);
    if (!nodes.length) {
      console.log('Text node ID not found in state');
      return;
    }

    nodes[0].textValue = e.target.value;

    if (e.keyCode === 13) {
      this.setState({
        textEditVisible: false,
        textNodes: copyOfNodes
      });
    }
  };  
  handleDragStart = e => {
    e.target.setAttrs({
      scaleX: 1.1,
      scaleY: 1.1
    });
  };
  handleDragEnd = e => {
    console.log(e.target.getAbsolutePosition(this.layerNode));
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1
    });
  };

  loadFromJson = () => {
    const obj = JSON.parse(localStorage.getItem("konva"));
    console.log(obj.images);
    this.setState({
      images: obj.images
    });
    const textNodes = [];
    obj.children[0].children.forEach(child => {
      if (child.className === "Text") {
        console.log(child.attrs);
        textNodes.push({...child.attrs});
      }
    });

    this.setState({
      textNodes
    });    
  };

  saveToJson = () => {
    // save stage as a json string
    const jsonString = this.stageNode.toJSON();
    const imageNodes = this.layerNode.find("Image");
    const jsonObject = JSON.parse(jsonString);
    jsonObject.images = [];
    imageNodes.forEach(element => {
      console.log(element.image().src);
      jsonObject.images.push({ id: element.id(), url: element.image().src });
    });
    localStorage.setItem("konva", JSON.stringify(jsonObject));
  };
  addText = () => {
    console.log(this.state.textNodes);
    this.setState({
      textNodes: [...this.state.textNodes, { 
        id: getRandomInt(), 
        textX: 0,
        textY: 0,
        textValue: "Hello"
      }]
    });
  };
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
          width={window.innerWidth}
          height={window.innerHeight}
        >
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
            {this.state.textNodes.map(text => {
              return <EditableText 
                key={text.id || getRandomInt()} 
                onDragStart={this.handleDragStart} 
                onDragEnd={this.handleDragEnd} 
                {...text} 
                updateTextState={this.updateTextState} />
              // return <Text key={text.id || getRandomInt()} {...text} />;
            })}
            {this.state.images.map(image => {
              return <SimpleApp key={image.id} id={image.id} url={image.url} />;
            })}
          </Layer>
        </Stage>
        <textarea
          value={this.state.textValue}
          style={{
            display: this.state.textEditVisible ? "block" : "none",
            position: "absolute",
            top: this.state.textY + "px",
            left: this.state.textX + "px"
          }}
          onChange={this.handleTextAreaEdit}
          onKeyDown={this.handleTextareaKeyDown}
        />        
      </div>
    );
  }
}

export default App;
