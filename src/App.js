import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Text, Transformer, Label, Tag } from "react-konva";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Label
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={e => {
          // transformer is changing scale
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY
          });
        }}
      >
        <Tag fill="white" stroke="black" strokeWidth={4} lineJoin="round" />
        <Text
          text="With Transformer"
          fontFamily="Calibri"
          fontSize={18}
          padding={5}
          fill="black"
        />
      </Label>
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};

const initialRectangles = [
  {
    x: 150,
    y: 50,
    width: 100,
    height: 100,
    fill: "white",
    id: "rect1",
    stroke: "black",
    strokeWidth: 4
  }
];

const ConfiguredRectangle = () => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectedId, selectShape] = React.useState(null);

  return (
    <Rectangle
      shapeProps={initialRectangles[0]}
      isSelected={initialRectangles[0].id === selectedId}
      onSelect={() => {
        selectShape(initialRectangles[0].id);
      }}
      onChange={newAttrs => {
        const rects = rectangles.slice();
        initialRectangles[0] = newAttrs;
        setRectangles(rects);
      }}
    />
  );
};

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
          <ConfiguredRectangle />
          <Label draggable x={150} y={50}>
            <Tag fill="white" stroke="black" strokeWidth={4} lineJoin="round" />
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
