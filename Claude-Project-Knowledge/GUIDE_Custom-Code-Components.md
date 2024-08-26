<tags>react, components, framer, typescript</tags>

Code Components
Code Components are custom React components written in TypeScript that can be added to your Framer project. These components allow for more complex interactions and use of third-party libraries.

Key Points:
Must be a single, function-based .tsx file with inlined CSS.
The <Component> returned can accept motion props.
Use Framer's auto-sizing options where applicable.
Ensure props are spread correctly to support Framer's sizing options.
Example Code Component:
import { motion } from "framer-motion";

import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  const { text, color, style } = props;


  return (

    <motion.div style={{ ...style, backgroundColor: color }}>

      {text}

    </motion.div>

  );

}


MyComponent.defaultProps = {

  text: "Hello World!",

  color: "#09f",

};


addPropertyControls(MyComponent, {

  text: { type: ControlType.String, title: "Text" },

  color: { type: ControlType.Color, title: "Background Color" },

});

Writing Custom Code Components
Import Necessary Modules:
Import motion from framer-motion.
Import addPropertyControls and ControlType from framer.
Define the Component Function:
Use a function-based component.
Inline CSS styles.
Implement Property Controls:
Use addPropertyControls to add customizable properties in the Framer UI.

Property Controls
Property controls allow users to configure the components props in Framer's UI. Below are the different types of property controls and their usage:

Adding Property Controls:
import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return <div>{props.text}</div>;

}


MyComponent.defaultProps = {

  text: "Hello World!",

};


addPropertyControls(MyComponent, {

  text: { type: ControlType.String, title: "Text" },

});

Types of Property Controls
String
Accepts plain text values, is provided directly as a property.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return <div>{props.text}</div>;

}


MyComponent.defaultProps = {

  text: "Hello World!",

};


addPropertyControls(MyComponent, {

  text: {

    type: ControlType.String,

    defaultValue: "Hello World",

    placeholder: "Type something…",

  },

});

Number
Accepts any numeric value, is provided directly as a property. Can be displayed as a range slider or a stepper.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return (

    <motion.div rotateZ={props.rotation} style={{ width: 50, height: 50 }}>

      {props.rotation}

    </motion.div>

  );

}


MyComponent.defaultProps = {

  rotation: 0,

};


addPropertyControls(MyComponent, {

  rotation: {

    type: ControlType.Number,

    defaultValue: 0,

    min: 0,

    max: 360,

    unit: "deg",

    step: 0.1,

    displayStepper: true,

  },

});

Boolean
A control that displays an on/off toggle.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return (

    <div style={{ minHeight: 50, minWidth: 50 }}>

      {props.showText ? "Hello World" : null}

    </div>

  );

}


MyComponent.defaultProps = {

  showText: true,

};


addPropertyControls(MyComponent, {

  showText: {

    type: ControlType.Boolean,

    title: "Show Text",

    defaultValue: true,

    enabledTitle: "On",

    disabledTitle: "Off",

  },

});

Color
A color value included in the component props as a string.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return <div style={{ backgroundColor: props.background, width: 50, height: 50 }} />;

}


MyComponent.defaultProps = {

  background: "#fff",

};


addPropertyControls(MyComponent, {

  background: {

    type: ControlType.Color,

    defaultValue: "#fff",

  },

});

Enum
A list of options. Contains primitive values where each value is unique.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  const value = props.value || "a";

  const colors = { a: "red", b: "green", c: "blue" };

  return (

    <div

      style={{

        backgroundColor: colors[value],

        width: 50,

        height: 50

      }}

    >

      {value}

    </div>

  );

}


MyComponent.defaultProps = {

  value: "a",

};


addPropertyControls(MyComponent, {

  value: {

    type: ControlType.Enum,

    defaultValue: "a",

    displaySegmentedControl: true,

    options: ["a", "b", "c"],

    optionTitles: ["Option A", "Option B", "Option C"],

  },

});

Image
An image included in the component props as a URL string.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return <img src={props.image} style={{ width: 200, height: 200 }} />;

}


MyComponent.defaultProps = {

  image: "",

};


addPropertyControls(MyComponent, {

  image: {

    type: ControlType.Image,

  },

});

File
Allows the user to pick a file. Included in component props as a URL string.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return (

      <video

        style={{ objectFit: "contain", ...props.style }}

        src={props.filepath}

        controls

      />

  );

}


MyComponent.defaultProps = {

  filepath: "",

};


addPropertyControls(MyComponent, {

  filepath: {

    type: ControlType.File,

    allowedFileTypes: ["mov"],

  },

});

Array
Allows multiple values per control type, provided as an array.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  const frames = props.images.map(image => {

    return <img src={image} style={{ width: 50, height: 50 }} />;

  });



  return <div style={{ display: "flex", gap: 10 }}>{frames}</div>;

}


MyComponent.defaultProps = {

  images: [],

};


addPropertyControls(MyComponent, {

  images: {

    type: ControlType.Array,

    control: {

      type: ControlType.Image

    },

    maxCount: 5,

  },

});

Object
Allows for grouping multiple properties as an object.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return (

    <div

      style={{

        opacity: props.myObject.opacity,

        backgroundColor: props.myObject.tint

      }}

    />

  );

}


MyComponent.defaultProps = {

  myObject: {

    opacity: 1,

    tint: "#09F"

  }

};


addPropertyControls(MyComponent, {

  myObject: {

    type: ControlType.Object,

    controls: {

      opacity: { type: ControlType.Number },

      tint: { type: ControlType.Color },

    }

  },

});

Transition
Allows for editing Framer Motion transition options within the Framer UI.


import { motion } from "framer-motion";

import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return (

      <motion.div

         animate={{ scale: 2 }}

         transition={props.transition}

      />

  );

}


MyComponent.defaultProps = {

  transition: { duration: 0.5 }

};


addPropertyControls(MyComponent, {

  transition: {

      type: ControlType.Transition,

  },

});

Font
Provides extended font controls, allowing customization of font family, size, weight, line height, and spacing.


import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 */


export function MyComponent(props) {

  return (

    <div style={{ fontFamily: props.font.family, fontSize: props.font.size }}>

      {props.text}

    </div>

  );

}


MyComponent.defaultProps = {

  text: "Hello World!",

  font: {

    family: "Inter",

    size: 16,

    weight: 400,

    lineHeight: "1.5em",

  }

};


addPropertyControls(MyComponent, {

  text: { type: ControlType.String, title: "Text" },

  font: {

    type: ControlType.Font,

    title: "Font",

    defaultValue: "Inter",

    controls: "extended",

  },

});

Applying Extended Font Control
To apply extended font control properties to a component, use the “...font” approach, instead of applying props.fontFamily, props.fontSize and everything separately. This allows you to easily spread the font properties onto the component's style, enabling full customization of the font settings directly within Framer.


IMPORTANT: If you try applying font properties separately like props.fontFamily, props.fontSize and so on, it will not work. Always use “...font”.


Example Component with Extended Font Control:

import * as React from "react";

import { addPropertyControls, ControlType } from "framer";

import { motion } from "framer-motion";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 300

 * @framerIntrinsicHeight 50

 * @framerSupportedLayoutWidth any

 * @framerSupportedLayoutHeight any

 */


export default function TextWithFontComponent(props) {

  const {

    text,

    font,

    textColor,

    backgroundColor,

    padding,

    borderRadius,

  } = props;


  const style = {

    backgroundColor,

    color: textColor,

    padding: `${padding}px`,

    borderRadius: `${borderRadius}px`,

    ...font,

  };


  return <motion.div style={style}>{text}</motion.div>;

}


TextWithFontComponent.defaultProps = {

  text: "Sample Text",

  font: {

    fontFamily: "Inter",

    fontWeight: "Regular",

    fontSize: 16,

    lineHeight: "1.5em",

  },

  textColor: "#000",

  backgroundColor: "#fff",

  padding: 10,

  borderRadius: 5,

};


addPropertyControls(TextWithFontComponent, {

  text: { type: ControlType.String, title: "Text" },

  font: {

    type: ControlType.Font,

    title: "Font",

    defaultValue: TextWithFontComponent.defaultProps.font,

    controls: "extended",

  },

  textColor: {

    type: ControlType.Color,

    title: "Text Color",

    defaultValue: "#000",

  },

  backgroundColor: {

    type: ControlType.Color,

    title: "Background Color",

    defaultValue: "#fff",

  },

  padding: {

    type: ControlType.Number,

    title: "Padding",

    defaultValue: 10,

    min: 0,

    max: 100,

    step: 1,

  },

  borderRadius: {

    type: ControlType.Number,

    title: "Border Radius",

    defaultValue: 5,

    min: 0,

    max: 50,

    step: 1,

  },

});

Framer Specific Declarations
Framer-specific annotations provide additional metadata about the components. These annotations control component sizing and default behavior.

Common Annotations:
@framerDisableUnlink: Prevents the component from being unlinked from the main component when modified.
@framerIntrinsicWidth: Sets the intrinsic width of the component.
@framerIntrinsicHeight: Sets the intrinsic height of the component.
@framerSupportedLayoutWidth: Controls the supported width options (any, auto, fixed).
@framerSupportedLayoutHeight: Controls the supported height options (any, auto, fixed).
Example with Annotations:
import { motion } from "framer-motion";

import { addPropertyControls, ControlType } from "framer";


/**

 * @framerDisableUnlink

 * @framerIntrinsicWidth 100

 * @framerIntrinsicHeight 100

 * @framerSupportedLayoutWidth any

 * @framerSupportedLayoutHeight auto

 */


export function MyComponent(props) {

  return (

    <motion.div style={{ ...props.style, backgroundColor: props.color }}>

      {props.text}

    </motion.div>

  );

}


MyComponent.defaultProps = {

  text: "Hello World!",

  color: "#09f",

};


addPropertyControls(MyComponent, {

  text: { type: ControlType.String, title: "Text" },

  color: { type: ControlType.Color, title: "Background Color" },

  font: {

    type: ControlType.Font,

    title: "Font",

    defaultValue: "Inter",

    controls: "extended",

  },

});
