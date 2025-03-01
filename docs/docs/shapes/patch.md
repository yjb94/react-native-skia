---
id: patch
title: Patch
sidebar_label: Patch
slug: /shapes/patch
---

Draws a [Coons patch](https://en.wikipedia.org/wiki/Coons_patch).

| Name      | Type      |  Description                                                  |
|:----------|:----------|:--------------------------------------------------------------|
| cubics | `CubicBezier[4]` | Specifies four cubic Bezier starting at the top-left corner, in clockwise order, sharing every fourth point. The last cubic Bezier ends at the first point. |
| textures   | `Point[]`.   | [Texture mapping](https://en.wikipedia.org/wiki/Texture_mapping). The texture is the shader provided by the paint |
| colors?    | `string[]`   | Optional colors to be associated to each corner |
| blendMode? | `BlendMode`  | If `colors` is provided, colors are blended with the paint using the blend mode. Default is `dstOver` if colors are provided, `srcOver` if not |

## Example

```tsx twoslash
import {Canvas, Patch, vec} from "@shopify/react-native-skia";

const PatchDemo = () => {
  const colors = ["#61dafb", "#fb61da", "#61fbcf", "#dafb61"];
  const C = 64;
  const topLeft = { src: vec(0, 0), c1: vec(C, 0), c2: vec(0, C) };
  const topRight = { src: vec(256, 0), c1: vec(256 + C, 0), c2: vec(256, C) };
  const bottomRight = {
    src: vec(256, 256),
    c1: vec(256 - 2 * C, 256),
    c2: vec(256, 256 - 2 * C),
  };
  const bottomLeft = {
    src: vec(0, 256),
    c1: vec(-2 * C, 256),
    c2: vec(0, 256 - 2 * C),
  };
  return (
    <Canvas style={{ flex: 1 }}>
      <Patch
        colors={colors}
        cubics={[topLeft, topRight, bottomRight, bottomLeft]}
      />
    </Canvas>
  );
};
```

![SVG Notation](assets/patch/example1.png)