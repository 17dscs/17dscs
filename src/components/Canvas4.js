import ActionCanvas from "../actionCanvas/ActionCanvas";

export default class Canvas4 {
  $parent;
  $target;
  $actionCanvas;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");
    this.$actionCanvas = new ActionCanvas(this.$target);

    this.render(this.$parent, this.$target);

    this.$target.style.height = "200px";
    this.$target.style.backgroundColor = "red";
    this.$target.style.display = "flex";
    this.$target.style.justifyContent = "center";
    this.$target.style.alignItems = "center";
  }

  render($parent, element) {
    $parent.append(element);
  }
}
