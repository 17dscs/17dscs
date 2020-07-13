export default class Dscomponent {
  $container;
  $target;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");
    this.render(this.$parent, this.$target);
    this.$target.innerHTML = "Hello";
  }

  render($container, element) {
    $container.innerHTML = "";
    $container.append(element);
  }
}
