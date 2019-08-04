import React from "react";
import { Text } from "react-konva";

class EditableText extends React.Component {
  handleTextDblClick = e => {
    this.props.updateTextState(e);
  };

  render() {
    return (
    <Text
    draggable
        id={this.props.id}
        text={this.props.text}
        x={this.props.x}
        y={this.props.y}
        fontSize={20}
        onDblClick={this.handleTextDblClick}
      />
    );
  }
}

export default EditableText;
