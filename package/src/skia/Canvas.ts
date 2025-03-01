import type { IPaint } from "./Paint";
import type { IRect } from "./Rect";
import type { Font } from "./Font";
import type { IPath } from "./Path";
import type { IImage } from "./Image";
import type { SVG } from "./SVG";
import type { Color } from "./Color";
import type { IRRect } from "./RRect";
import type { BlendMode } from "./Paint/BlendMode";
import type { IPoint, PointMode } from "./Point";
import type { Matrix } from "./Matrix";
import type { IImageFilter } from "./ImageFilter";
import type { MipmapMode, FilterMode } from "./Image/Image";

export enum ClipOp {
  Difference,
  Intersect,
}

export interface ICanvas {
  /**
   * Draws the given image with its top-left corner at (left, top) using the current clip,
   * the current matrix, and optionally-provided paint.
   * @param img
   * @param left
   * @param top
   * @param paint
   */
  drawImage: (image: IImage, x: number, y: number, paint?: IPaint) => void;

  /**
   * Draws sub-rectangle src from provided image, scaled and translated to fill dst rectangle.
   * @param img
   * @param src
   * @param dest
   * @param paint
   * @param fastSample - if false, will filter strictly within src.
   */
  drawImageRect(
    img: IImage,
    src: IRect,
    dest: IRect,
    paint: IPaint,
    fastSample?: boolean
  ): void;

  /**
   * Draws the given image with its top-left corner at (left, top) using the current clip,
   * the current matrix. It will use the cubic sampling options B and C if necessary.
   * @param img
   * @param left
   * @param top
   * @param B - See CubicResampler in SkSamplingOptions.h for more information
   * @param C - See CubicResampler in SkSamplingOptions.h for more information
   * @param paint
   */
  drawImageCubic(
    img: IImage,
    left: number,
    top: number,
    B: number,
    C: number,
    paint?: IPaint | null
  ): void;

  /**
   * Draws the given image with its top-left corner at (left, top) using the current clip,
   * the current matrix. It will use the provided sampling options if necessary.
   * @param img
   * @param left
   * @param top
   * @param fm - The filter mode.
   * @param mm - The mipmap mode. Note: for settings other than None, the image must have mipmaps
   *             calculated with makeCopyWithDefaultMipmaps;
   * @param paint
   */
  drawImageOptions(
    img: IImage,
    left: number,
    top: number,
    fm: FilterMode,
    mm: MipmapMode,
    paint?: IPaint | null
  ): void;

  /**
   *  Draws the provided image stretched proportionally to fit into dst rectangle.
   *  The center rectangle divides the image into nine sections: four sides, four corners, and
   *  the center.
   * @param img
   * @param center
   * @param dest
   * @param filter - what technique to use when sampling the image
   * @param paint
   */
  drawImageNine(
    img: IImage,
    center: IRect,
    dest: IRect,
    filter: FilterMode,
    paint?: IPaint | null
  ): void;

  /**
   * Draws sub-rectangle src from provided image, scaled and translated to fill dst rectangle.
   * It will use the cubic sampling options B and C if necessary.
   * @param img
   * @param src
   * @param dest
   * @param B - See CubicResampler in SkSamplingOptions.h for more information
   * @param C - See CubicResampler in SkSamplingOptions.h for more information
   * @param paint
   */
  drawImageRectCubic(
    img: IImage,
    src: IRect,
    dest: IRect,
    B: number,
    C: number,
    paint?: IPaint | null
  ): void;

  /**
   * Draws sub-rectangle src from provided image, scaled and translated to fill dst rectangle.
   * It will use the provided sampling options if necessary.
   * @param img
   * @param src
   * @param dest
   * @param fm - The filter mode.
   * @param mm - The mipmap mode. Note: for settings other than None, the image must have mipmaps
   *             calculated with makeCopyWithDefaultMipmaps;
   * @param paint
   */
  drawImageRectOptions(
    img: IImage,
    src: IRect,
    dest: IRect,
    fm: FilterMode,
    mm: MipmapMode,
    paint?: IPaint | null
  ): void;

  /** Fills clip with SkPaint paint. SkPaint components, SkShader,
        SkColorFilter, SkImageFilter, and SkBlendMode affect drawing;
        SkMaskFilter and SkPathEffect in paint are ignored.

        @param paint  graphics state used to fill SkCanvas

        example: https://fiddle.skia.org/c/@Canvas_drawPaint
    */
  drawPaint: (paint: IPaint) => void;

  /** Draws line segment from (x0, y0) to (x1, y1) using clip, SkMatrix, and SkPaint paint.
        In paint: SkPaint stroke width describes the line thickness;
        SkPaint::Cap draws the end rounded or square;
        SkPaint::Style is ignored, as if were set to SkPaint::kStroke_Style.

        @param x0     start of line segment on x-axis
        @param y0     start of line segment on y-axis
        @param x1     end of line segment on x-axis
        @param y1     end of line segment on y-axis
        @param paint  stroke, blend, color, and so on, used to draw

        example: https://fiddle.skia.org/c/@Canvas_drawLine
    */
  drawLine: (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    paint: IPaint
  ) => void;
  /** Draws SkRect rect using clip, SkMatrix, and SkPaint paint.
        In paint: SkPaint::Style determines if rectangle is stroked or filled;
        if stroked, SkPaint stroke width describes the line thickness, and
        SkPaint::Join draws the corners rounded or square.

        @param rect   rectangle to draw
        @param paint  stroke or fill, blend, color, and so on, used to draw

        example: https://fiddle.skia.org/c/@Canvas_drawRect
    */
  drawRect: (rect: IRect, paint: IPaint) => void;

  /**
   * Draws a circle at (cx, cy) with the given radius.
   * @param cx
   * @param cy
   * @param radius
   * @param paint
   */
  drawCircle(cx: number, cy: number, radius: number, paint: IPaint): void;

  /**
   * Draws a cubic patch defined by 12 control points [top, right, bottom, left] with optional
   * colors and shader-coordinates [4] specifed for each corner [top-left, top-right, bottom-right, bottom-left]
   * @param cubics 12 points : 4 connected cubics specifying the boundary of the patch
   * @param colors optional colors interpolated across the patch
   * @param texs optional shader coordinates interpolated across the patch
   * @param mode Specifies how shader and colors blend (if both are specified)
   * @param paint
   */
  drawPatch(
    cubics: IPoint[],
    colors?: Color[] | null,
    texs?: IPoint[] | null,
    mode?: BlendMode | null,
    paint?: IPaint
  ): void;

  /**
   * Restores state to a previous stack value.
   * @param saveCount
   */
  restoreToCount(saveCount: number): void;

  /**
   * Draws the given points using the current clip, current matrix, and the provided paint.
   *
   * See Canvas.h for more on the mode and its interaction with paint.
   * @param mode
   * @param points
   * @param paint
   */
  drawPoints(mode: PointMode, points: IPoint[], paint: IPaint): void;

  /** Draws arc using clip, SkMatrix, and SkPaint paint.

        Arc is part of oval bounded by oval, sweeping from startAngle to startAngle plus
        sweepAngle. startAngle and sweepAngle are in degrees.

        startAngle of zero places start point at the right middle edge of oval.
        A positive sweepAngle places arc end point clockwise from start point;
        a negative sweepAngle places arc end point counterclockwise from start point.
        sweepAngle may exceed 360 degrees, a full circle.
        If useCenter is true, draw a wedge that includes lines from oval
        center to arc end points. If useCenter is false, draw arc between end points.

        If SkRect oval is empty or sweepAngle is zero, nothing is drawn.

        @param oval        SkRect bounds of oval containing arc to draw
        @param startAngle  angle in degrees where arc begins
        @param sweepAngle  sweep angle in degrees; positive is clockwise
        @param useCenter   if true, include the center of the oval
        @param paint       SkPaint stroke or fill, blend, color, and so on, used to draw
    */
  drawArc: (
    oval: IRect,
    startAngle: number,
    sweepAngle: number,
    useCenter: boolean,
    paint: IPaint
  ) => void;

  /**
   * Draws the given rectangle with rounded corners using the current clip, current matrix,
   * and the provided paint.
   * @param rrect
   * @param paint
   */
  drawRRect(rrect: IRRect, paint: IPaint): void;

  /**
   * Draws RRect outer and inner using clip, Matrix, and Paint paint.
   * outer must contain inner or the drawing is undefined.
   * @param outer
   * @param inner
   * @param paint
   */
  drawDRRect(outer: IRRect, inner: IRRect, paint: IPaint): void;

  /**
   * Draws an oval bounded by the given rectangle using the current clip, current matrix,
   * and the provided paint.
   * @param oval
   * @param paint
   */
  drawOval(oval: IRect, paint: IPaint): void;

  /** Draws SkPath path using clip, SkMatrix, and SkPaint paint.
        SkPath contains an array of path contour, each of which may be open or closed.

        In paint: SkPaint::Style determines if SkRRect is stroked or filled:
        if filled, SkPath::FillType determines whether path contour describes inside or
        outside of fill; if stroked, SkPaint stroke width describes the line thickness,
        SkPaint::Cap describes line ends, and SkPaint::Join describes how
        corners are drawn.

        @param path   SkPath to draw
        @param paint  stroke, blend, color, and so on, used to draw

        example: https://fiddle.skia.org/c/@Canvas_drawPath
    */
  drawPath: (path: IPath, paint: IPaint) => void;

  /**
   * Draw the given text at the location (x, y) using the provided paint and font. The text will
   * be drawn as is; no shaping, left-to-right, etc.
   * @param str
   * @param x
   * @param y
   * @param paint
   * @param font
   */
  drawText(str: string, x: number, y: number, paint: IPaint, font: Font): void;

  /**
   * Renders the SVG Dom object to the canvas. If width/height are omitted,
   * the SVG will be rendered to fit the canvas.
   */
  drawSvg: (svgDom: SVG, width?: number, height?: number) => void;
  /** Saves SkMatrix and clip.
        Calling restore() discards changes to SkMatrix and clip,
        restoring the SkMatrix and clip to their state when save() was called.

        SkMatrix may be changed by translate(), scale(), rotate(), skew(), concat(), setMatrix(),
        and resetMatrix(). Clip may be changed by clipRect(), clipRRect(), clipPath(), clipRegion().

        Saved SkCanvas state is put on a stack; multiple calls to save() should be balance
        by an equal number of calls to restore().

        Call restoreToCount() with result to restore this and subsequent saves.

        @return  depth of saved stack

        example: https://fiddle.skia.org/c/@Canvas_save
    */
  save: () => number;

  /**
   * Saves Matrix and clip, and allocates a SkBitmap for subsequent drawing.
   * Calling restore() discards changes to Matrix and clip, and draws the SkBitmap.
   * It returns the height of the stack.
   * See Canvas.h for more.
   * @param paint
   * @param bounds
   * @param backdrop
   * @param flags
   */
  saveLayer(
    paint?: IPaint,
    bounds?: IRect | null,
    backdrop?: IImageFilter | null,
    flags?: number
  ): number;

  /**
   * Saves Matrix and clip, and allocates a SkBitmap for subsequent drawing.
   * Calling restore() discards changes to Matrix and clip, and draws the SkBitmap.
   * It returns the height of the stack.
   * See Canvas.h for more.
   * @param paint
   */
  saveLayerPaint(paint?: IPaint): number;

  /** Removes changes to SkMatrix and clip since SkCanvas state was
        last saved. The state is removed from the stack.

        Does nothing if the stack is empty.

        example: https://fiddle.skia.org/c/@AutoCanvasRestore_restore

        example: https://fiddle.skia.org/c/@Canvas_restore
    */
  restore: () => void;

  /**
   * Rotates the current matrix by the number of degrees.
   * @param rot - angle of rotation in degrees.
   * @param rx
   * @param ry
   */
  rotate(rotationInDegrees: number, rx: number, ry: number): void;

  /**
   * Scales the current matrix by sx on the x-axis and sy on the y-axis.
   * @param sx
   * @param sy
   */
  scale(sx: number, sy: number): void;

  /**
   *  Skews Matrix by sx on the x-axis and sy on the y-axis. A positive value of sx
   *  skews the drawing right as y-axis values increase; a positive value of sy skews
   *  the drawing down as x-axis values increase.
   * @param sx
   * @param sy
   */
  skew(sx: number, sy: number): void;

  /**
   * Translates Matrix by dx along the x-axis and dy along the y-axis.
   * @param dx
   * @param dy
   */
  translate(dx: number, dy: number): void;

  /**
   * Fills clip with the given color.
   * @param color
   * @param blendMode - defaults to SrcOver.
   */
  drawColor(color: Color, blendMode?: BlendMode): void;

  /**
   * Fills the current clip with the given color using Src BlendMode.
   * This has the effect of replacing all pixels contained by clip with color.
   * @param color
   */
  clear(color: Color): void;

  /**
   * Replaces clip with the intersection or difference of the current clip and path,
   * with an aliased or anti-aliased clip edge.
   * @param path
   * @param op
   * @param doAntiAlias
   */
  clipPath(path: IPath, op: ClipOp, doAntiAlias: boolean): void;

  /**
   * Replaces clip with the intersection or difference of the current clip and rect,
   * with an aliased or anti-aliased clip edge.
   * @param rect
   * @param op
   * @param doAntiAlias
   */
  clipRect(rect: IRect, op: ClipOp, doAntiAlias: boolean): void;

  /**
   * Replaces clip with the intersection or difference of the current clip and rrect,
   * with an aliased or anti-aliased clip edge.
   * @param rrect
   * @param op
   * @param doAntiAlias
   */
  clipRRect(rrect: IRRect, op: ClipOp, doAntiAlias: boolean): void;

  /**
   * Replaces current matrix with m premultiplied with the existing matrix.
   * @param m
   */
  concat(m: Matrix): void;
}
