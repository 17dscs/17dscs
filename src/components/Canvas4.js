export default class Canvas4 {
  $parent;
  $target;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");

    this.render(this.$parent, this.$target);

    this.$target.style.height = "200px";
    this.$target.style.backgroundColor = "red";
  }

  render($parent, element) {
    $parent.append(element);
  }
}
