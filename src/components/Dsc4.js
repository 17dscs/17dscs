import Canvas4 from "./Canvas4";
import Simulation4 from "./Simulation4";

export default class Dsc4 {
  $parent;
  $target;
  $simulationComp;
  $canvasComp;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");
    this.$simulationComp = new Simulation4(this.$target);
    this.$canvasComp = new Canvas4(this.$target);

    this.render(this.$parent, this.$target);

    this.$target.style.display = "flex";
    this.$target.style.flexDirection = "column";
  }

  render($parent, element) {
    $parent.append(element);
  }
}
