class Canvas4 {
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

class Canvas4$1 {
  $parent;
  $target;
  $actionCanvas;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");
    this.$actionCanvas = new Canvas4(this.$target);

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

class Simulation4 {
  $parent;
  $target;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");

    this.render(this.$parent, this.$target);

    this.$target.style.height = "100px";
    this.$target.style.backgroundColor = "blue";
  }

  render($parent, element) {
    $parent.append(element);
  }
}

class Dsc4 {
  $parent;
  $target;
  $simulationComp;
  $canvasComp;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");
    this.$simulationComp = new Simulation4(this.$target);
    this.$canvasComp = new Canvas4$1(this.$target);

    this.render(this.$parent, this.$target);

    this.$target.style.display = "flex";
    this.$target.style.flexDirection = "column";
  }

  render($parent, element) {
    $parent.append(element);
  }
}

class Dscomponent {
  $container;
  $target;
  constructor(name) {
    const $container = document.getElementById(`${name}`);
    this.$container = $container;
    this.$target = null;

    if ($container) this.$target = new Dsc4(this.$container);
  }
}
