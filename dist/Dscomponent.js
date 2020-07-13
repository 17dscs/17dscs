class Dsc4 {
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

class Dscomponent {
  $container;
  $target;
  constructor(name) {
    const $container = document.getElementById(`${name}`);
    this.$container = $container;
    this.$target = null;

    if ($container) this.$target = new Dsc4($container);
  }
}
