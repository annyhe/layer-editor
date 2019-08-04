import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Image } from "react-konva";
import EditableText from "./EditableText";
import MovableLine from "./MovableLine";
import useImage from "use-image";

const FAVICON_URL = process.env.PUBLIC_URL + '/favicon.ico';
const url = "https://konvajs.github.io/assets/yoda.jpg";
function getRandomInt() {
  return parseInt(Math.random() * 1000, 10);
}
function ImageRender(props) {
  const [image] = useImage(props.url || url);

  // "image" will DOM image element or undefined
  const _id = getRandomInt;
  return <Image id={props.id || _id} draggable image={image} />;
}

class App extends Component {
  state = {
    images: [],
    textNodes: [],
    textEditVisible: false,
    // for temporary text edits
    x: 0,
    y: 0,
    text: "hello world",
    currentTextNodeID: 0,
    // for line
    lines: [
      {
        x: 100,
        y: 100,
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 100
      }
    ]
  };
  updateTextState = e => {
    // e.target refers to Text instead of textarea
    const absPos = e.target.getAbsolutePosition();
    const nodeID = e.target.id();

    const copyOfNodes = [...this.state.textNodes];
    const node = copyOfNodes.filter(node => node.id === nodeID);
    node.x = absPos.x;
    node.y = absPos.y;

    this.setState(
      {
        text: e.target.text(),
        textEditVisible: true,
        textNodes: copyOfNodes,
        x: absPos.x,
        y: absPos.y,
        currentTextNodeID: nodeID
      },
      () => {
        console.log("from callback");
      }
    );
  };
  handleTextAreaEdit = e => {
    this.setState({
      text: e.target.value
    });
  };
  handleTextareaKeyDown = e => {
    const copyOfNodes = [...this.state.textNodes];
    const nodes = copyOfNodes.filter(
      node => node.id === this.state.currentTextNodeID
    );
    if (!nodes.length) {
      console.log("Text node ID not found in state");
      return;
    }

    nodes[0].text = e.target.value;

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
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1
    });
  };

  loadFromJson = () => {
    const obj = JSON.parse(localStorage.getItem("konva"));
    this.setState({
      images: obj.images
    });
    const textNodes = [];
    obj.children[0].children.forEach(child => {
      if (child.className === "Text") {
        textNodes.push({ ...child.attrs });
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
      jsonObject.images.push({ id: element.id(), url: element.image().src });
    });
    localStorage.setItem("konva", JSON.stringify(jsonObject));
  };
  addText = () => {
    this.setState({
      textNodes: [
        ...this.state.textNodes,
        {
          id: getRandomInt(),
          x: 20,
          y: 20,
          text: "Hello"
        }
      ]
    });
  };
  saveImage = () => {
    // before calling toDataURL, need to make sure there are no externally loaded URLs
    // if there are http... urls, need to swap them out with local versions
    // ? need to send image ids back to the server too? but the arrays are ordered...
    const remoteUrls = this.state.images.map((image) => {
      return image.url.startsWith('http');
    }).map((image) => image.url);

    // POST to save the images, get local links back
    const localLinks = Array.apply(null, Array(remoteUrls.length))
      .map(function (x) { return FAVICON_URL; })

    // swap out the remote urls with local urls
    const copyOfImages = [...this.state.images];
    copyOfImages.forEach((image) => {
      if (image.url.startsWith('http')) image.url = localLinks.shift();
    });
    this.setState({ images: copyOfImages }, () => {
      const base64String = this.stageNode.toDataURL();
      this.downloadLink.download = "stage.png";
      this.downloadLink.href = base64String;
      this.downloadLink.click();  
    });
  };
  handleLineDragEnd = e => {
    this.setState({
      x: e.target.x(),
      y: e.target.y()
    });
  };
  addImage = () => {
    const copyOfImages = [...this.state.images];
    copyOfImages.push({id: getRandomInt(), url: FAVICON_URL});
    this.setState({
      images: copyOfImages
    })
  }
  render() {
    return (
      <div>
        <a
          style={{
            display: "none"
          }}
          ref={node => {
            this.downloadLink = node;
          }}
          href="#"
        >
          {" "}
          Download link
        </a>
        <button onClick={this.saveImage}>Save image</button>
        <button onClick={this.addImage}>Add image</button>
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
              height={500}
              fill="white"
              stroke="black"
              strokeWidth={4}
            />
            <MovableLine
              handleLineDragEnd={this.handleLineDragEnd}
              {...this.state.lines[0]}
              />
            {this.state.textNodes.map(text => {
              return (
                <EditableText
                  key={text.id || getRandomInt()}
                  onDragStart={this.handleDragStart}
                  onDragEnd={this.handleDragEnd}
                  {...text}
                  updateTextState={this.updateTextState}
                />
              );
            })}
            {this.state.images.map(image => {
              return <ImageRender key={image.id} id={image.id} url={image.url} />;
            })}
          </Layer>
        </Stage>
        <textarea
          ref={textarea => textarea && textarea.focus()}
          value={this.state.text}
          style={{
            display: this.state.textEditVisible ? "block" : "none",
            position: "absolute",
            top: this.state.y + "px",
            left: this.state.x + "px"
          }}
          onChange={this.handleTextAreaEdit}
          onKeyDown={this.handleTextareaKeyDown}
        />
      </div>
    );
  }
}

export default App;
