export default class Canvas4 {
  $parent;
  $target;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("canvas");

    this.render(this.$parent, this.$target);

    this.$target.style.margin = "5px";
    this.$target.style.backgroundColor = "brown";
  }

  render($parent, element) {
    $parent.append(element);
  }
}
