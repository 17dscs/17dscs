import actionCanvas from "../actionCanvas/actionCanvas";

export default class Canvas4 {
  $parent;
  $target;
  $actionCanvas;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");
    this.$actionCanvas = document.createElement("canvas");
    this.$actionCanvas.id = "test-canvas";

    this.render(this.$parent, this.$target);
    this.render(this.$target, this.$actionCanvas);

    this.$target.style.height = "200px";
    this.$target.style.display = "flex";
    this.$target.style.justifyContent = "center";
    this.$target.style.alignItems = "center";
    actionCanvas(this.$actionCanvas);
  }

  render($parent, element) {
    $parent.append(element);
  }
}
