import data from "../datas/data";
import chart from "../simulators/chart";

export default class Simulation4 {
  $parent;
  $target;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("canvas");
    this.$target.id = "test-canvas2";
    this.$target.width = 400;
    this.$target.height = 100;

    this.render(this.$parent, this.$target);

    chart(this.$target);
  }

  render($parent, element) {
    $parent.append(element);
  }
}
