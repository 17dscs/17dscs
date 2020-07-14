import data from "../datas/data";

export default class Simulation4 {
  $parent;
  $target;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");

    this.render(this.$parent, this.$target);

    this.$target.style.height = "100px";
    this.$target.style.backgroundColor = "blue";
    this.$target.addEventListener("mouseenter", () => {
      data.increase();
      console.log(data);
    });
  }

  render($parent, element) {
    $parent.append(element);
  }
}
